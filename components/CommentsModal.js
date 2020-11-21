import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Title, IconButton, Modal, Portal, Provider, Text, Button, useTheme, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';

import { commentsModalVisible, commentType, commentIndex } from '../Actions/index';
import modalStyles from '../styles/ModalStyles';
import { TRACK_COMMENTS, ADD_COMMENT } from '../queries/graphQlQueries';
import formStyles from '../styles/FormStyles';
import { setSnackbarMessage } from '../Actions/index';


const CommentsModal = ({ trackId }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const isCommentsModalVisible = useSelector(state => state.commentsModalVisible);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyToArtistId, setReplyToArtistId] = useState('');
    const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT);

    const { loading, error, data, refetch } = useQuery(
        TRACK_COMMENTS,
        {
            variables: { trackId },

        }
    );

    useEffect(() => {
        if (!commentLoading) {
            setReplyToArtistId('');
            setShowCommentBox(false);
            setNewComment('');
            dispatch(setSnackbarMessage('Comment added'));
            refetch();
        }
    }, [commentLoading]);

    const closeModal = () => {
        dispatch(commentsModalVisible(false));
        dispatch(commentIndex(-1))
        dispatch(commentType(''));
    }

    const formatDate = d => {
        const date = new Date(d);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        let year = date.getFullYear().toString();
        year = year.substring(2, year.length);

        return `${day} ${monthName} '${year}`;
    }

    const postComment = () => {
        addComment({
            variables: {
                trackId: trackId,
                comment: newComment,
                artistId: '5fb65286bfb5104b84f6b587',
                replyToArtistId: replyToArtistId.length > 0 ? replyToArtistId : ''
            }
        });
    }

    const openCommentAsReply = commentArtistId => {
        setShowCommentBox(true);
        setReplyToArtistId(commentArtistId);
    }

    return (
        <Provider>
            <Portal>
                <Modal visible={isCommentsModalVisible} onDismiss={closeModal} contentContainerStyle={styles.modalContainerStyles}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={{ ...styles.queueContainer, ...styles.sectionContainer }}>
                            <Title style={styles.modalTitle}>Comments</Title>
                            {data ? data.comments.map((comment, index) => (
                                <View style={styles.commentContainer} key={index}>
                                    <View style={styles.userAndDateContainer}>
                                        <Text style={styles.commentUser}>{comment.artist.artistName}</Text>
                                        <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
                                    </View>
                                    <View style={styles.commentTextContainer}>
                                        <Text style={styles.commentText}>
                                            {comment.replyToArtistId &&
                                                <Text style={{color: colors.primary}}>@{comment.replyToArtistId}  </Text>
                                            }
                                              {comment.comment}
                                        </Text>
                                        <IconButton animated icon="reply" size={20} onPress={() => openCommentAsReply(comment.artistId)} />
                                    </View>
                                </View>
                            )) : <Text>No comments</Text>
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.newCommentContainer}>
                        {!showCommentBox ?
                            <Button color={colors.primary} mode='contained' onPress={() => setShowCommentBox(true)}>Add comment</Button> :
                            <>
                                <View style={styles.boxContainer}>
                                    <TextInput
                                        mode='outlined'
                                        theme={{ colors: { primary: colors.primary } }}
                                        color={colors.primary}
                                        style={{ ...styles.input, height: 50 }}
                                        label='Comment'
                                        value={newComment}
                                        onChangeText={comm => setNewComment(comm)}
                                        multiline
                                    />
                                    {newComment.length > 0 &&
                                        <IconButton style={styles.clearIcon} animated icon="comment-remove" size={25} onPress={() => setNewComment('')} />
                                    }
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button disabled={newComment.length < 1} color={colors.primary} mode='contained' onPress={() => postComment()}>Submit</Button>
                                    <Button color={colors.primary} mode='contained' onPress={() => setShowCommentBox(false)}>Cancel</Button>
                                </View>
                            </>
                        }
                    </View>
                    <IconButton style={styles.closeIcon} animated icon="close" size={25} onPress={closeModal} />
                </Modal>
            </Portal>
        </Provider>
    )
}

CommentsModal.propTypes = {
    colors: PropTypes.object
}

const styles = StyleSheet.create({
    ...formStyles,
    ...modalStyles, ...{
        input: {
            flexGrow: 1
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        modalTitle: {
            marginTop: 10,
            marginBottom: 20
        },
        scrollView: {

        },
        queueContainer: {
            marginTop: 0
        },
        commentContainer: {
            width: '100%',
            padding: 5,
            marginBottom: 10,
            borderWidth: 1,
            borderRadius: 7,
            borderColor: 'gray'
        },
        commentUser: {
            fontSize: 20
        },
        commentText: {
            fontSize: 16,
            width: '90%'
        },
        replyContainer: {
            marginLeft: 20,
            marginTop: 5
        },
        newCommentContainer: {
            width: '100%',
            bottom: 10,
            borderRadius: 3
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        commentTextContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        },
        userAndDateContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        date: {
            fontSize: 14
        },
        boxContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 20
        },
        clearIcon: {
            position: 'absolute',
            right: 0,
            top: 5,
            zIndex: 100
        }
    }
});

export default CommentsModal;