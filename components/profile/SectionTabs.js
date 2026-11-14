import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import theme from "../../styles/theme";

export default function SectionTabs({ sections = [], active, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {sections.filter(Boolean).map((name) => {
        const selected = name === active;
        return (
          <Pressable
            key={name}
            onPress={() => onSelect(name)}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { 
    flexGrow: 0, 
    marginBottom: theme.spacing.medium 
  },
  row: { 
    gap: 6 
  },
  tab: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
  },
  tabSelected: { 
    backgroundColor: theme.colors.primary, 
    borderColor: theme.colors.primary 
  },
  text: { 
    color: theme.fontColor.secondary, 
    fontSize: theme.fontSize.small, 
    fontWeight: theme.fontWeight.bold 
  },
  textSelected: { 
    color: theme.fontColor.dark 
  },
});