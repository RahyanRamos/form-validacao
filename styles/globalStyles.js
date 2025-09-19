import { StyleSheet } from "react-native";

export const palette = {
  // Fundos
  bg: "#0A0F1A",          // quase preto azulado
  surface: "#162338",      // cartão mais claro para contraste
  surfaceAlt: "#101a2b",
  // Texto
  text: "#F3F4F6",         // quase branco (alto contraste)
  textMuted: "#C7D2FE",    // lilás claro (lê bem sobre azul escuro)
  placeholder: "#9FB4D3",  // placeholder mais claro e legível
  // Estados
  primary: "#8AB4FF",
  primaryAlt: "#3B82F6",
  danger: "#FF7B86",
  success: "#34D399",
  // Bordas / inputs
  border: "#2B3B5E",
  inputBg: "#0E1A2C",
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
    fontSize: 26,
    fontWeight: "800",
    color: palette.text,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  sectionCard: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 17,
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
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: palette.inputBg,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: palette.primary,
    shadowColor: palette.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    fontWeight: "700",
  },
  button: {
    backgroundColor: palette.primaryAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  buttonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
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
    opacity: 0.9,
  },
});