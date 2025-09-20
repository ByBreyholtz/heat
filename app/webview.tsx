import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WebViewScreen() {
  const { url: initialUrl } = useLocalSearchParams<{ url?: string }>();
  const [url, setUrl] = useState(initialUrl || 'https://www.nordicsauna.com');
  const [currentUrl, setCurrentUrl] = useState(url);
  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleGoBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleGoToUrl = () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setCurrentUrl(formattedUrl);
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setLoading(navState.loading);
  };

  const webViewRef = React.useRef<WebView>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Web Browser</ThemedText>
          <ThemedText style={styles.subtitle}>Browse the web within the app</ThemedText>
        </ThemedView>

        <ThemedView style={styles.urlContainer}>
          <TextInput
            style={styles.urlInput}
            placeholder="Enter website URL..."
            placeholderTextColor="#666"
            value={url}
            onChangeText={setUrl}
            onSubmitEditing={handleGoToUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TouchableOpacity style={styles.goButton} onPress={handleGoToUrl}>
            <ThemedText style={styles.goButtonText}>Go</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, !canGoBack && styles.controlButtonDisabled]}
            onPress={handleGoBack}
            disabled={!canGoBack}
          >
            <ThemedText style={[styles.controlButtonText, !canGoBack && styles.controlButtonTextDisabled]}>
              ← Back
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !canGoForward && styles.controlButtonDisabled]}
            onPress={handleGoForward}
            disabled={!canGoForward}
          >
            <ThemedText style={[styles.controlButtonText, !canGoForward && styles.controlButtonTextDisabled]}>
              Forward →
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleRefresh}>
            <ThemedText style={styles.controlButtonText}>🔄 Refresh</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={() => router.back()}>
            <ThemedText style={styles.controlButtonText}>✕ Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <View style={styles.webViewContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B4513" />
              <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </View>
          )}
          
          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              Alert.alert('Error', `Failed to load: ${nativeEvent.description}`);
            }}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.currentUrl} numberOfLines={1}>
            {currentUrl}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  urlContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  urlInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  goButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  controlButtonTextDisabled: {
    color: '#999',
  },
  webViewContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  currentUrl: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});
