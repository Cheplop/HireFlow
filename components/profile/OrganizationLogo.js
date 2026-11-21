import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";

const ORGANIZATION_DOMAINS = [
  ["amazon web services", "aws.amazon.com"],
  ["aws", "aws.amazon.com"],
  ["harvard", "harvard.edu"],
  ["amazon", "amazon.com"],
  ["world wide web consortium", "w3.org"],
  ["w3c", "w3.org"],
];

function getLogoSource(name) {
  const normalizedName = (name ?? "").toLowerCase();
  const match = ORGANIZATION_DOMAINS.find(([organization]) =>
    normalizedName.includes(organization),
  );

  return match
    ? { uri: `https://www.google.com/s2/favicons?domain=${match[1]}&sz=128` }
    : null;
}

function getInitials(name) {
  return (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "?";
}

export default function OrganizationLogo({ name, style }) {
  const source = getLogoSource(name);
  const [imageFailed, setImageFailed] = useState(false);

  if (source && !imageFailed) {
    return (
      <View style={[styles.logoFrame, style]}>
        <Image
          source={source}
          style={styles.image}
          resizeMode="contain"
          onError={() => setImageFailed(true)}
          accessibilityLabel={`${name} logo`}
        />
      </View>
    );
  }

  return (
    <View style={[styles.fallback, style]} accessibilityLabel={`${name} logo`}>
      <Text style={styles.initials}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoFrame: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: theme.radius.small,
    overflow: "hidden",
  },
  image: {
    width: "82%",
    height: "82%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.small,
    backgroundColor: theme.actions.editBg,
  },
  initials: {
    color: theme.actions.editPrimary,
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
});
