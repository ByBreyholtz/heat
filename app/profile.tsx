import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("norwegian");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            {/* Empty space for centered back button */}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Summary Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileCenter}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>Morten Vik</Text>
              <Text style={styles.profileLocation}>Bergen, Norway</Text>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.settingsContainer}>
            {/* Settings Switches */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Settings</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications" size={24} color="#666666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive booking updates and reminders
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E5E7EB", true: "#10B981" }}
                  thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="location" size={24} color="#666666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Location Services</Text>
                    <Text style={styles.settingDescription}>
                      Find nearby saunas automatically
                    </Text>
                  </View>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: "#E5E7EB", true: "#10B981" }}
                  thumbColor={locationEnabled ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="language" size={24} color="#666666" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Language</Text>
                    <Text style={styles.settingDescription}>
                      Choose your preferred language
                    </Text>
                  </View>
                </View>
                <View style={styles.languageSelector}>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      selectedLanguage === "norwegian" &&
                        styles.languageOptionActive,
                    ]}
                    onPress={() => setSelectedLanguage("norwegian")}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        selectedLanguage === "norwegian" &&
                          styles.languageTextActive,
                      ]}
                    >
                      NO
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      selectedLanguage === "english" &&
                        styles.languageOptionActive,
                    ]}
                    onPress={() => setSelectedLanguage("english")}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        selectedLanguage === "english" &&
                          styles.languageTextActive,
                      ]}
                    >
                      EN
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* App Version Info */}
            <View style={styles.appInfoCard}>
              <Text style={styles.appInfoTitle}>App Information</Text>
              <View style={styles.appInfoRow}>
                <Text style={styles.appInfoLabel}>Version</Text>
                <Text style={styles.appInfoValue}>1.0.0</Text>
              </View>
              <View style={styles.appInfoRow}>
                <Text style={styles.appInfoLabel}>Build</Text>
                <Text style={styles.appInfoValue}>2024.1</Text>
              </View>
              <View style={styles.appInfoRow}>
                <Text style={styles.appInfoLabel}>Last Updated</Text>
                <Text style={styles.appInfoValue}>December 2024</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCenter: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
    textAlign: "center",
  },
  profileLocation: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  appInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  appInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  appInfoLabel: {
    fontSize: 16,
    color: "#666666",
  },
  appInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
  },
  languageSelector: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 2,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
  },
  languageOptionActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  languageTextActive: {
    color: "#000000",
  },
});
