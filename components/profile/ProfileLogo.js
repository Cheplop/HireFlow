import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import theme from "../../styles/theme";

export default function ProfileLogo({ source, kind = "company", style }) {
  const [failedSource, setFailedSource] = useState(null);
  const sourceKey =
    source && typeof source === "object" ? source.uri ?? source : source;
  const hasFailed = failedSource === sourceKey;

  return (
    <View style={[styles.container, style]}>
      {source && !hasFailed ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode="contain"
          onError={() => setFailedSource(sourceKey)}
        />
      ) : (
        <Ionicons
          name={kind === "school" ? "school-outline" : "briefcase-outline"}
          size={22}
          color={theme.colors.primary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    backgroundColor: theme.actions.editBg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
