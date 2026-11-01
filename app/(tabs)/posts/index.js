
import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../components/PrimaryButton';
import { AuthInput } from '../../../components/AuthInput';
import { PostsContext } from '../../../contexts/PostsContext';

const brandColor = '#4B5694';

export default function Posts() {
    const { posts, fetchPosts, createPost, updatePost, deletePost } = useContext(PostsContext);

    const [postId, setPostId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts().catch(error => setError(error.message));
    }, [fetchPosts]);


function savePost() {
    const numericPostId = Number(postId);
    const numericPrice = Number(price);

    if (!editingPost && (!numericPostId || numericPostId < 1 || !Number.isInteger(numericPostId))) {
        setError('Enter a valid product ID.');
        return;
    }

    if (!editingPost && posts.some(post => post.id === numericPostId)) {
        setError('That ID already exists.');
        return;
    }

    if (!title.trim() || !description.trim()) {
        setError('Enter a title and description.');
        return;
    }

    if (!price.trim() || isNaN(numericPrice) || numericPrice < 0) {
        setError('Enter a valid price.');
        return;
    }

    if (photoUrl.trim() && !photoUrl.startsWith('http')) {
        setError('Enter a valid photo URL.');
        return;
    }

    setError('');

    const postData = {
        ...(!editingPost && { id: numericPostId }),
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        thumbnail: photoUrl.trim(),
    };

    if (editingPost) {
        updatePost(editingPost.id, postData)
            .then(cancelEditing)
            .catch(error => setError(error.message));
    } else {
        createPost(postData)
            .then(cancelEditing)
            .catch(error => setError(error.message));
    }
}


    function startEditing(post) {
        setEditingPost(post);
        setPostId(String(post.id));
        setTitle(post.title);
        setDescription(post.description || '');
        setPrice(String(post.price ?? ''));
        setPhotoUrl(post.thumbnail || post.images?.[0] || '');
        setError('');
    }

    function cancelEditing() {
        setEditingPost(null);
        setPostId('');
        setTitle('');
        setDescription('');
        setPrice('');
        setPhotoUrl('');
        setError('');
    }

    function handleDelete(id) {
        setError('');
        deletePost(id).catch(error => setError(error.message));
    }

    if (posts === null) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loading}>
                    {error || 'Loading products...'}
                </Text>
            </SafeAreaView>
        );
    }

    function renderPost({ item }) {
        const imageUrl = item.thumbnail || item.images?.[0];

        return (
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    {imageUrl ? (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`View ${item.title}`}
                            onPress={() => router.push(`/posts/${encodeURIComponent(String(item.id))}`)}
                        >
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.postImage}
                            />
                        </Pressable>
                    ) : (
                        <View style={[styles.postImage, styles.noImage]}>
                            <Text style={styles.mutedText}>No image</Text>
                        </View>
                    )}

                    <View style={styles.postInfo}>
                        <Text style={styles.postId}>ID: {item.id}</Text>

                        <Text style={styles.postTitle}>
                            {item.title}
                        </Text>

                        <Text style={styles.postPrice}>
                            ${Number(item.price || 0).toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={styles.postActions}>
                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="View"
                            variant="secondary"
                            onPress={() => router.push(`/posts/${item.id}`)}
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="Edit"
                            variant="secondary"
                            onPress={() => startEditing(item)}
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <PrimaryButton
                            title="Delete"
                            variant="secondary"
                            onPress={() => handleDelete(item.id)}
                        />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={item => String(item.id)}
                renderItem={renderPost}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View>
                        <Text style={styles.screenTitle}>
                            My Products
                        </Text>

                        <Text style={styles.screenSubtitle}>
                            Create and manage your products.
                        </Text>

                        <View style={styles.formCard}>
                            <Text style={styles.formTitle}>
                                {editingPost ? 'Edit Product' : 'Create Product'}
                            </Text>

                            <Text style={styles.formSubtitle}>
                                {editingPost
                                    ? 'Update your product details below.'
                                    : 'Fill in the details to add a product.'}
                            </Text>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            <View style={styles.inputGroup}>
                                <AuthInput
                                    label="Product ID"
                                    value={postId}
                                    onChangeText={setPostId}
                                    placeholder="Enter a unique numeric ID"
                                    keyboardType="number-pad"
                                    editable={!editingPost}
                                />

                                <AuthInput
                                    label="Title"
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Enter product title"
                                />

                                <AuthInput
                                    label="Description"
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Enter product description"
                                />

                                <AuthInput
                                    label="Price"
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="Enter price"
                                    keyboardType="decimal-pad"
                                />

                                <AuthInput
                                    label="Photo URL (optional)"
                                    value={photoUrl}
                                    onChangeText={setPhotoUrl}
                                    placeholder="Paste an image URL"
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.formButton}>
                                <PrimaryButton
                                    title={editingPost ? 'Save Changes' : 'Create Product'}
                                    onPress={savePost}
                                />
                            </View>

                            {editingPost ? (
                                <PrimaryButton
                                    title="Cancel Editing"
                                    variant="secondary"
                                    onPress={cancelEditing}
                                />
                            ) : null}
                        </View>

                        <View style={styles.listHeading}>
                            <Text style={styles.sectionTitle}>
                                Existing Products
                            </Text>

                            <Text style={styles.productCount}>
                                {posts.length} products
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No products yet. Create your first product above.
                    </Text>
                }
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FC',
    },

    listContent: {
        padding: 20,
        paddingBottom: 35,
    },

    screenTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#252A40',
    },

    screenSubtitle: {
        fontSize: 14,
        color: '#777D90',
        marginTop: 5,
        marginBottom: 22,
    },

    formCard: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9EBF3',
        gap: 12,
    },

    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#252A40',
    },

    formSubtitle: {
        fontSize: 13,
        color: '#777D90',
        marginTop: -5,
    },

    inputGroup: {
        gap: 12,
        marginTop: 5,
    },

    formButton: {
        marginTop: 5,
    },

    errorBox: {
        backgroundColor: '#FFF0F0',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F2CCCC',
    },

    errorText: {
        color: '#B42318',
        fontSize: 13,
    },

    listHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#252A40',
    },

    productCount: {
        fontSize: 12,
        color: brandColor,
        fontWeight: '600',
    },

    postCard: {
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9EBF3',
        gap: 14,
    },

    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    postImage: {
        width: 85,
        height: 85,
        borderRadius: 10,
        backgroundColor: '#F0F2F8',
        resizeMode: 'contain',
    },

    noImage: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    mutedText: {
        fontSize: 11,
        color: '#777D90',
    },

    postInfo: {
        flex: 1,
        gap: 5,
    },

    postId: {
        fontSize: 12,
        color: '#777D90',
    },

    postTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#252A40',
    },

    postPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: brandColor,
    },

    postActions: {
        flexDirection: 'row',
        gap: 8,
    },

    actionButton: {
        flex: 1,
    },

    separator: {
        height: 12,
    },

    emptyText: {
        textAlign: 'center',
        color: '#777D90',
        paddingVertical: 25,
    },

    loading: {
        padding: 20,
        color: '#252A40',
    },
});
