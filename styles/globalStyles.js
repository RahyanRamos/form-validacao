import { StyleSheet } from "react-native";

export const palette = {
  bg: "#0B0F1A",
  surface: "#121826",
  surfaceAlt: "#0F1629",
  text: "#E5E7EB",
  textMuted: "#9CA3AF",
  primary: "#7AA2F7",
  primaryAlt: "#3B82F6",
  danger: "#F87171",
  border: "#1F2A44",
  success: "#10B981",
  inputBg: "#0F1629",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 16,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    color: palette.textMuted,
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: palette.inputBg,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: palette.primary,
    shadowColor: palette.primary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputError: {
    borderColor: palette.danger,
  },
  helpText: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 12,
  },
  errorText: {
    marginTop: 6,
    color: palette.danger,
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: palette.primaryAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: "#0D1B2A",
    borderColor: palette.border,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  chipText: {
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 8,
    opacity: 0.8,
  },
});