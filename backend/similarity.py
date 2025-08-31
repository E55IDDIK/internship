import numpy as np
import json

def calculate_cosine_similarity(vect1, vect2):
    #calculate cosine similarity between two vectors.
    v1=np.array(vect1)
    v2=np.array(vect2)
    if np.linalg.norm(v1)==0 or np.linalg.norm(v2)==0:
        return 0.0
    return np.dot(v1,v2)/(np.linalg.norm(v1)*np.linalg.norm(v2))
