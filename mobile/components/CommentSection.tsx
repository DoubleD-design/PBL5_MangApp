import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import commentService, { Comment, CreateCommentData } from '../services/commentService';

interface CommentSectionProps {
  mangaId: number;
  currentUserId?: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ mangaId, currentUserId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getCommentsByMangaId(mangaId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [mangaId]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    const commentData: CreateCommentData = {
      mangaId,
      content: newComment.trim(),
    };

    try {
      await commentService.createComment(commentData);
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Failed to send comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#888" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : comments.length === 0 ? (
        <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
      ) : (
        <ScrollView nestedScrollEnabled={true} style={styles.commentsList}>
          {comments.map((comment) => (
            <View key={comment.id.toString()} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.username}>{comment.username}</Text>
                <Text style={styles.timestamp}>{new Date(comment.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          multiline
          value={newComment}
          onChangeText={setNewComment}
          editable={!submitting}
          returnKeyType="send"
          onSubmitEditing={handleSendComment}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.button, (submitting || !newComment.trim()) && styles.buttonDisabled]}
          onPress={handleSendComment}
          disabled={submitting || !newComment.trim()}
        >
          <Text style={styles.buttonText}>{submitting ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(59, 42, 26, 0)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#b5e745',
  },
  commentsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  commentCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  noComments: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CommentSection;
