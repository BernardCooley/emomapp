import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Title, IconButton, Modal, Portal, Provider, Text, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { commentsModalVisible, commentType, commentIndex } from '../Actions/index';
import modalStyles from '../styles/ModalStyles';
import CommentBox from '../components/CommentBox';


const CommentsModal = () => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const isCommentsModalVisible = useSelector(state => state.commentsModalVisible);
    const currentTrackComments = useSelector(state => state.trackComments);
    const currentCommentType = useSelector(state => state.commentType);
    const currentCommentIndex = useSelector(state => state.commentIndex);

    const openCommentBox = (currentCommentType, commentInd) => {
        dispatch(commentType(currentCommentType));
        
        if(commentInd > -1) {
            dispatch(commentIndex(commentInd))
        }
    }

    const closeModal = () => {
        dispatch(commentsModalVisible(false));
        dispatch(commentIndex(-1))
        dispatch(commentType(''));
    }

    const formatDate = d => {
        const date = d.toDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        let year = date.getFullYear().toString();
        year = year.substring(0, year.length - 2);

        return `${day} ${monthName} '${year}`;
    }

    return (
        <Provider>
            <Portal>
                <Modal visible={isCommentsModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainerStyles}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={{ ...styles.queueContainer, ...styles.sectionContainer }}>
                            <Title style={styles.modalTitle}>Comments</Title>
                            {currentTrackComments && currentTrackComments.length > 0 ? currentTrackComments.map((comment, index) => (
                                <View style={styles.commentContainer} key={index}>
                                    <View style={styles.userAndDateContainer}>
                                        <Text style={styles.commentUser}>{comment.artistName}</Text>
                                        <Text style={styles.date}>{formatDate(comment.date)}</Text>
                                    </View>
                                    <View style={styles.commentTextContainer}>
                                        <Text style={styles.commentText}>{comment.comment}</Text>
                                        <IconButton animated icon="reply" size={20} onPress={() => openCommentBox('Reply', index)} />
                                    </View>
                                    {comment.replies ? comment.replies.sort((a, b) => (a.date > b.date) ? 1 : -1).map((reply, index) => (
                                        <View style={styles.replyContainer} key={index}>
                                            <View style={styles.userAndDateContainer}>
                                                <Text style={styles.commentUser}>{comment.artistName}</Text>
                                                <Text style={styles.date}>{formatDate(comment.date)}</Text>
                                            </View>
                                            <Text style={styles.commentText}>{reply.comment}</Text>
                                        </View>
                                    )) : null
                                    }
                                    {currentCommentType === 'Reply' && index == currentCommentIndex ?
                                        <CommentBox colors={colors} /> : null
                                    }
                                </View>
                            )) : <Text>No comments</Text>
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.newCommentContainer}>
                        {currentCommentType === '' &&
                            <Button color={colors.primary} mode='contained' onPress={() => openCommentBox('New comment')}>Add comment</Button>
                        }
                        {currentCommentType === 'New comment' ?
                            <CommentBox colors={colors}  /> : null
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
    ...modalStyles, ...{
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
            borderColor: 'gray',
            backgroundColor: '#C4C4C4'
        },
        commentUser: {
            fontSize: 20
        },
        commentText: {
            fontSize: 16
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
            alignItems: 'center'
        },
        userAndDateContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        date: {
            fontSize: 14
        }
    }
});

export default CommentsModal;