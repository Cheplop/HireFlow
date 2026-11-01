import { useContext, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostsContext } from '../../../../contexts/PostsContext';
import theme from '../../../../styles/theme';

const brandColor = '#4B5694';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;

  const { fetchPostById } = useContext(PostsContext);

  const [result, setResult] = useState({
    postId: null,
    post: null,
    error: '',
  });

  useEffect(() => {
    if (!postId) return;

    let isActive = true;

    fetchPostById(postId)
      .then((product) => {
        if (isActive) setResult({ postId, post: product, error: '' });
      })
      .catch((requestError) => {
        if (isActive) {
          setResult({
            postId,
            post: null,
            error: requestError.message || 'Could not load product.',
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [fetchPostById, postId]);

  const resultIsCurrent = result.postId === postId;
  const post = resultIsCurrent ? result.post : null;
  const error = !postId
    ? 'Product not found.'
    : resultIsCurrent
      ? result.error
      : '';

  if (postId && !resultIsCurrent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>
            {error || 'Product not found.'}
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Product Details</Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {post.thumbnail ? (
          <Image
            source={{ uri: post.thumbnail }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>No photo available</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.title}>{post.title}</Text>

          <Text style={styles.price}>
            ${Number(post.price).toFixed(2)}
          </Text>

          <Text style={styles.description}>
            {post.description}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.dimensionsTitle}>Dimensions</Text>
          {post.dimensions ? (
            <Text style={styles.dimensions}>
              {`Width: ${post.dimensions.width ?? '—'}  ·  Height: ${post.dimensions.height ?? '—'}  ·  Depth: ${post.dimensions.depth ?? '—'}`}
            </Text>
          ) : (
            <Text style={styles.dimensions}>Dimensions not available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  back: {
    fontSize: 32,
    color: brandColor,
  },

  headerTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: '700',
    color: theme.fontColor.primary,
  },

  content: {
    padding: 20,
    gap: 15,
  },

  image: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 12,
  },

  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePlaceholderText: {
    color: theme.fontColor.secondary,
  },

  card: {
    padding: 20,
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.fontColor.primary,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    color: brandColor,
  },

  description: {
    fontSize: theme.fontSize.medium,
    lineHeight: 23,
    color: theme.fontColor.secondary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
    backgroundColor: '#E8EAF0',
  },

  dimensionsTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: '700',
    color: theme.fontColor.primary,
  },

  dimensions: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    padding: 20,
  },

  error: {
    textAlign: 'center',
    color: theme.fontColor.secondary,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: brandColor,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});