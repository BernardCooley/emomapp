import React from 'react';
import { TextInput, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { usePlayerContext } from '../contexts/PlayerContext';

import { commentType, newComment, commentIndex } from '../Actions/index';
import formStyles from '../styles/FormStyles';


const CommentBox = ({ colors }) => {
    const dispatch = useDispatch();
    const playerContext = usePlayerContext();
    const usersRef = firestore().collection('users');
    const tracksRef = firestore().collection('tracks');
    const currentTrackComments = useSelector(state => state.trackComments);
    const currentCommentType = useSelector(state => state.commentType);
    const currentNewComment = useSelector(state => state.newComment);
    const currentCommentIndex = useSelector(state => state.commentIndex);

    const postNewComment = async () => {
        if (currentNewComment.length > 0) {

            await usersRef.doc(auth().currentUser.uid).get().then(async response => {
                const com = {
                    artist: response.data().artist,
                    comment: currentNewComment,
                    userId: auth().currentUser.uid,
                    date: new Date()
                }

                if (currentCommentType === 'Reply') {
                    if (!currentTrackComments[currentCommentIndex].replies) {
                        currentTrackComments[currentCommentIndex]['replies'] = [];
                    }
                    currentTrackComments[currentCommentIndex].replies.push(com)
                } else if (currentCommentType === 'New comment') {
                    currentTrackComments.push(com);
                }

                addCommentToDB(currentTrackComments);
            })
        }
    }

    const addCommentToDB = async newComments => {
        await tracksRef.doc(playerContext.currentTrack.id).update({
            comments: newComments
        }).then(() => {
            dispatch(commentType(''));
            dispatch(newComment(''));
        });
    }

    const cancelComment = () => {
        dispatch(newComment(''));
        dispatch(commentIndex(-1));
        dispatch(commentType(''));
    }

    return (
        <>
            <TextInput
                mode='outlined'
                theme={{ colors: { primary: colors.primary } }}
                color={colors.primary}
                style={{ ...styles.input, height: 50 }}
                label='Comment'
                value={currentNewComment}
                onChangeText={comm => dispatch(newComment(comm))}
                multiline
            />
            <View style={styles.buttonContainer}>
                <Button color={colors.primary} mode='contained' onPress={() => postNewComment()}>Submit</Button>
                <Button color={colors.primary} mode='contained' onPress={cancelComment}>Cancel</Button>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    ...formStyles,
    ...{
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
        }
    }
});

export default CommentBox