import os
from re import T
import spotipy
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials
from flask_restful import Api, Resource, reqparse
import numpy as np
from sklearn.neighbors import KNeighborsClassifier as knn
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from sklearn.preprocessing import MinMaxScaler
from collections import Counter
from os.path import join, dirname, realpath

#? This takes in 3 playlists and generates a numpy array 
#? to describe them based on spotify metadata (3 rows pertaining to playlist)
#? call this function when a new user submits 3 playlists

#? each playlist vector for other users is plotted in n-D space
#? each vector is retrieved from the database (excluding your own playlists)
#? find nearest 2 neighbours for each of your playlists (input into KNN model)
#? you will have 6 potential matches, your top 2 soulmates should be the majority of your 6 matches
#? retrieve thir Uid's send to eric so he can display their emails

class find_match(Resource):
    
    def get(self):
        
        #? FUNCTION DEFINITIONS
        #*given playlist links, extract features and upload to firebase dataset
        FTR_NAMES = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'valence']
        
        def extract_features(playlist_links):
            
            #list containing the averaged ftr vectors for all 3 playlists
            all_playlist_ftrs = []
            
            for playlist_link in playlist_links:
                
                print("CURRENT PLAYLIST", playlist_link)
                
                #each playlist is uniquely identifiable with a uniform resource identifier (URI)
                #extract playlist URI
                playlist_URI = playlist_link.split("/")[-1].split("?")[0]

                #extract URI's of tracks in playlist
                track_URIs = [x["track"]["uri"] for x in sp.playlist_tracks(playlist_URI)["items"]]
                
                #only keep the first 100 tracks (sp.audio_features can handle max 100 tracks)
                #get audio features for all tracks in a playlist
                ftrs = sp.audio_features(tracks=track_URIs)[:100]
                ftrs = [i for i in ftrs if i] #remove None values
                
                #turn the list of ftrs for tracks in the playlist into a pandas dataframe
                #extract only the ftrs you want
                #take the average along the columns
                #convert to numpy
                #append to all_playlist_ftrs
                all_playlist_ftrs.append(pd.DataFrame(ftrs).loc[:, FTR_NAMES].mean(axis=0).to_numpy())
            
            #convert the list of playlist ftrs to a 2D numpy array (num playlists x num ftrs)
            all_playlist_ftrs = np.array(all_playlist_ftrs)
            return all_playlist_ftrs
            
        
        #? OBTAINING USER'S PLAYLIST VECTOR
        
        #retrieving playlist links when get is called
        parser = reqparse.RequestParser()
        parser.add_argument('uid', type = str)
        parser.add_argument('playlist1', type=str)
        parser.add_argument('playlist2', type=str)
        parser.add_argument('playlist3', type=str)
        
        args = parser.parse_args()
        
        uid = args.get('uid')
        playlist1 = args.get('playlist1')
        playlist2 = args.get('playlist2')
        playlist3 = args.get('playlist3')
        
        #playlists = ['https://open.spotify.com/playlist/37i9dQZF1DX6ziVCJnEm59?si=455d856fcf37410b', 'https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL?si=f3d111f3d15d4c87', 'https://open.spotify.com/playlist/37i9dQZF1DXaohnPXGkLv6?si=c6aa84cf82ea4fb6']
        playlists = [playlist1, playlist2, playlist3]
        
        #authentication to access general spotify data
        client_credentials_manager = SpotifyClientCredentials(''' HIDDEN''')
        sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)

        #obtain a 2D numpy array representing all 3 playlists (num playlists x num ftrs)
        all_playlist_ftrs = extract_features(playlists)
        
        #? FIREBASE CREDENTIALS
        #firebase credentials, only initalize once
        if not firebase_admin._apps:
            cred = credentials.Certificate({
            # HIDDEN CREDS
        })
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        #?FINDING MATCH
        
        #get all the playlists vectors from other users in the database
        docs = db.collection(u'song_metadata_collection').stream()

        candidate_vec_dict = False #initialize to false, overwrite if there are enough users in database
        
        for doc in docs: #there is only one doc
            candidate_vec_dict = doc.to_dict()
            
        
        if candidate_vec_dict != False and len(candidate_vec_dict) != 1: #find match if is at least 2 other users (need to have top 2) 
            #candidates_vec_dict is a dictionary containing all the playlist vectors of other users
            #the keys are the uids
            #the values are another dictionary containing the 3 playlists
            #the keys are playlist 1, playlist2, etc. and values are lists of playlist ftrs
            labels = []
            data = []
            for uid_key in candidate_vec_dict:
                if uid_key == uid: #skip over yourself if you're somehow already in the database
                    continue
                curr_data = []
                for playlist_key in candidate_vec_dict[uid_key]:
                    curr_data.append(candidate_vec_dict[uid_key][playlist_key])
                    labels.append(uid_key)
                
                data = data + curr_data
            
            mms = MinMaxScaler()
            mms.fit(data)
            scaled_data = mms.transform(data)

            #plot playlist vectors for other users in n-d space
            model = knn(n_neighbors=2)
            model.fit(scaled_data, labels)
            
            #find top 2 matches for each of your playlists
            top_matches = []
            for i in range(len(all_playlist_ftrs)):
                _, indices = model.kneighbors(all_playlist_ftrs[i].reshape(1,-1), n_neighbors = 2)
                for j in range(len(indices[0])):
                    top_matches.append(labels[indices[0][j]])
            
            c = Counter(top_matches)
            top2_matches = c.most_common(2) #a list where each entry is the uid + the number of times it occured in top 6
            if len(top2_matches) == 1:
                top2_matches.append([top2_matches[0]])
        

        #? UPLOADING YOUR USER'S PLAYLIST FEATURES TO FIREBASE
        for i in range(len(all_playlist_ftrs)):
            data = {
                uid:{
                    "playlist" + str(i+1): list(all_playlist_ftrs[i])
                }
            }
            # add the data to the map
            db.collection(u'song_metadata_collection').document(u'user_vecs').set(data, merge=True)
            
        if candidate_vec_dict == False or len(candidate_vec_dict) == 1:
            print('Not enough users to match')
            return {
                'topTwoMatches': [['None', -1], ['None', -1]], 
            }
        
        #return top 2 users if there are other users
        #!testing flask
        #url: http://localhost:5000/flask/findmatch?uid=moomoo&playlist1=https://open.spotify.com/playlist/37i9dQZF1DX6ziVCJnEm59?si=455d856fcf37410b&playlist2=https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL?si=f3d111f3d15d4c87&playlist3=https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL?si=f3d111f3d15d4c87%27,%20%27https://open.spotify.com/playlist/37i9dQZF1DXaohnPXGkLv6?si=c6aa84cf82ea4fb6
        #url: http://localhost:5000/flask/findmatch?uid=moomoo&playlist1=https://open.spotify.com/playlist/2rcMRS9fDOnuu5YUTXAcQZ?si=cb975d39045642bc&playlist2=https://open.spotify.com/playlist/37i9dqzf1dxaohnpxgklv6?si=48802544a81f4be7&playlist3=https://open.spotify.com/playlist/37i9dqzf1dx6zivcjnem59?si=8151006c30344649
        return {
        'topTwoMatches': top2_matches,
        }
    
        
        
    def post(self):
        print(self)
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str)
        parser.add_argument('message', type=str)

        args = parser.parse_args()

        print(args)
        # note, the post req from frontend needs to match the strings here (e.g. 'type and 'message')

        request_type = args['type']
        request_json = args['message']
        # ret_status, ret_msg = ReturnData(request_type, request_json)
        # currently just returning the req straight
        ret_status = request_type
        ret_msg = request_json

        if ret_msg:
            message = "Your Message Requested: {}".format(ret_msg)
        else:
            message = "No Msg"
        
        final_ret = {"status": "Success", "message": message}

        return final_ret    
