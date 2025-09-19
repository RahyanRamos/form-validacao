import React, { useMemo, useState } from "react";
import {Text, View, TextInput, TouchableOpacity, Alert, ScrollView} from "react-native";
import { globalStyles } from "../styles/globalStyles";

/** =========================
 *  UTILITÁRIOS DE MÁSCARA
 *  ========================= */
const onlyDigits = (v) => (v || "").replace(/\D+/g, "");

const formatCPF = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.replace(/(\d{3})(\d+)/, "$1.$2");
  if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
};

const formatCEP = (v) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return d.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};

const formatTelefoneFixo = (v) => {
  const d = onlyDigits(v).slice(0, 10); // 2 (DDD) + 8
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return d.replace(/(\d{2})(\d+)/, "($1) $2");
  return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
};

const formatCelular = (v) => {
  const d = onlyDigits(v).slice(0, 11); // 2 (DDD) + 9
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return d.replace(/(\d{2})(\d+)/, "($1) $2");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

const formatDataBR = (v) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return d.replace(/(\d{2})(\d{0,2})/, "$1/$2");
  return d.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
};

/** =========================
 *  VALIDAÇÕES
 *  ========================= */
const isNomeCompletoValido = (nome) => {
  const clean = (nome || "").trim().replace(/\s+/g, " ");
  if (!clean) return false;
  const partes = clean.split(" ");
  return partes.length >= 2 && partes.every((p) => p.length >= 2);
};

const parseDataBR = (s) => {
  // Esperado: DD/MM/AAAA
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || "");
  if (!m) return null;
  const dd = Number(m[1]);
  const mm = Number(m[2]) - 1; // 0-based
  const yyyy = Number(m[3]);
  const d = new Date(yyyy, mm, dd);
  // Verifica se a data "bate" (JS ajusta datas inválidas automaticamente)
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm || d.getDate() !== dd) {
    return null;
  }
  return d;
};

const calcIdade = (nasc) => {
  if (!nasc) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};

const validaCPFAlg = (cpf) => {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  const calcDV = (baseLen) => {
    let soma = 0;
    for (let i = 0; i < baseLen; i++) soma += Number(d[i]) * (baseLen + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const dv1 = calcDV(9);
  const dv2 = calcDV(10);
  return dv1 === Number(d[9]) && dv2 === Number(d[10]);
};

const isTelefoneFixoValido = (tel) => {
  const d = onlyDigits(tel);
  return d.length === 10; // 2 DDD + 8
};

const isCelularValido = (tel) => {
  const d = onlyDigits(tel);
  // Regra geral: 11 dígitos, e o primeiro do número (após DDD) é 9
  return d.length === 11 && /^..9/.test(d);
};

const isCEPValido = (cep) => onlyDigits(cep).length === 8;

const isEmailValido = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email || "");

const senhaFeedback = (s) => {
  const msgs = [];
  if ((s || "").length < 8) msgs.push("mínimo de 8 caracteres");
  if (!/[a-z]/.test(s || "")) msgs.push("uma letra minúscula");
  if (!/[A-Z]/.test(s || "")) msgs.push("uma letra maiúscula");
  if (!/\d/.test(s || "")) msgs.push("um número");
  if (!/[^A-Za-z0-9]/.test(s || "")) msgs.push("um caractere especial");
  return msgs;
};

/** =========================
 *  COMPONENTE
 *  ========================= */
export default function Formulario() {
  /** Pessoais */
  const [nome, setNome] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [cpf, setCpf] = useState("");
  const [telFixo, setTelFixo] = useState("");
  const [cel, setCel] = useState("");

  /** Menores */
  const [pai, setPai] = useState("");
  const [mae, setMae] = useState("");

  /** Endereço */
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  /** Conta */
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");

  /** Erros */
  const [errors, setErrors] = useState({});

  /** Idade computada */
  const idade = useMemo(() => {
    const d = parseDataBR(dataNasc);
    return d ? calcIdade(d) : null;
  }, [dataNasc]);

  const isMenor = idade !== null && idade < 18;

  /** Validação campo-a-campo (tempo real) */
  const setField = (field, value) => {
    // Atualiza valor
    switch (field) {
      case "nome":
        setNome(value);
        break;
      case "dataNasc":
        setDataNasc(formatDataBR(value));
        break;
      case "cpf":
        setCpf(formatCPF(value));
        break;
      case "telFixo":
        setTelFixo(formatTelefoneFixo(value));
        break;
      case "cel":
        setCel(formatCelular(value));
        break;
      case "pai":
        setPai(value);
        break;
      case "mae":
        setMae(value);
        break;
      case "cep":
        setCep(formatCEP(value));
        break;
      case "endereco":
        setEndereco(value);
        break;
      case "numero":
        setNumero(value.replace(/[^\w\s-]/g, "")); // simples sanitização
        break;
      case "complemento":
        setComplemento(value);
        break;
      case "cidade":
        setCidade(value);
        break;
      case "estado":
        setEstado(value.toUpperCase().slice(0, 2));
        break;
      case "email":
        setEmail(value.trim());
        break;
      case "senha":
        setSenha(value);
        break;
      case "senha2":
        setSenha2(value);
        break;
      default:
        break;
    }

    // Valida imediatamente o campo alterado
    validateField(field, value);
  };

  const setError = (field, message) =>
    setErrors((prev) => ({ ...prev, [field]: message || "" }));

  const validateField = (field, rawValue) => {
    let value = rawValue;
    switch (field) {
      case "nome":
        setError(
          "nome",
          isNomeCompletoValido(value) ? "" : "Informe nome e sobrenome."
        );
        break;
      case "dataNasc": {
        const f = formatDataBR(value);
        const d = parseDataBR(f);
        if (!d) {
          setError("dataNasc", "Data inválida (use DD/MM/AAAA).");
        } else {
          const id = calcIdade(d);
          setError("dataNasc", id < 0 || id > 120 ? "Idade inválida." : "");
          // Ajusta obrigatoriedade dos campos pai/mãe
          if (id !== null && id < 18) {
            if (!isNomeCompletoValido(pai)) setError("pai", "Obrigatório para menores.");
            if (!isNomeCompletoValido(mae)) setError("mae", "Obrigatório para menores.");
          } else {
            setError("pai", "");
            setError("mae", "");
          }
        }
        break;
      }
      case "cpf":
        setError("cpf", validaCPFAlg(value) ? "" : "CPF inválido.");
        break;
      case "telFixo":
        setError("telFixo", isTelefoneFixoValido(value) ? "" : "Telefone fixo inválido. Use (DD) XXXX-XXXX.");
        break;
      case "cel":
        setError("cel", isCelularValido(value) ? "" : "Celular inválido. Use (DD) 9XXXX-XXXX.");
        break;
      case "pai":
        setError("pai", isMenor ? (isNomeCompletoValido(value) ? "" : "Obrigatório para menores.") : "");
        break;
      case "mae":
        setError("mae", isMenor ? (isNomeCompletoValido(value) ? "" : "Obrigatório para menores.") : "");
        break;
      case "cep":
        setError("cep", isCEPValido(value) ? "" : "CEP inválido.");
        break;
      case "endereco":
        setError("endereco", value?.trim() ? "" : "Endereço é obrigatório.");
        break;
      case "numero":
        setError("numero", value?.trim() ? "" : "Número é obrigatório.");
        break;
      case "cidade":
        setError("cidade", value?.trim() ? "" : "Cidade é obrigatória.");
        break;
      case "estado":
        setError("estado", /^[A-Z]{2}$/.test(value) ? "" : "UF deve ter 2 letras.");
        break;
      case "email":
        setError("email", isEmailValido(value) ? "" : "E-mail inválido.");
        break;
      case "senha": {
        const fb = senhaFeedback(value);
        setError("senha", fb.length ? `A senha precisa de: ${fb.join(", ")}.` : "");
        // revalida confirmação
        setError("senha2", value === senha2 ? "" : "Confirmação diferente da senha.");
        break;
      }
      case "senha2":
        setError("senha2", value === senha ? "" : "Confirmação diferente da senha.");
        break;
      default:
        break;
    }
  };

  const validateAll = () => {
    const fields = [
      "nome",
      "dataNasc",
      "cpf",
      "telFixo",
      "cel",
      "cep",
      "endereco",
      "numero",
      "cidade",
      "estado",
      "email",
      "senha",
      "senha2",
    ];
    if (isMenor) {
      fields.push("pai", "mae");
    }

    fields.forEach((f) => validateField(f, eval(f))); // usando eval apenas para compactar; alternativa: map de chaves-estado

    // verifica se houve algum erro preenchido
    const hasError = Object.values(errors).some((e) => e);
    // Também garante campos obrigatórios não vazios
    const obrig = {
      nome,
      dataNasc,
      cpf,
      telFixo,
      cel,
      cep,
      endereco,
      numero,
      cidade,
      estado,
      email,
      senha,
      senha2,
      ...(isMenor ? { pai, mae } : {}),
    };
    const algumVazio = Object.entries(obrig).some(
      ([k, v]) => !(v || "").toString().trim()
    );

    return !hasError && !algumVazio;
  };

  const handleSubmit = () => {
    try {
      if (!validateAll()) {
        Alert.alert("Formulário inválido", "Corrija os campos destacados.");
        return;
      }

      const payload = {
        nome,
        data_nascimento: dataNasc,
        idade,
        cpf: onlyDigits(cpf),
        telefone_fixo: onlyDigits(telFixo),
        celular: onlyDigits(cel),
        pai: isMenor ? pai : null,
        mae: isMenor ? mae : null,
        endereco: {
          cep: onlyDigits(cep),
          logradouro: endereco,
          numero,
          complemento: complemento || null,
          cidade,
          estado,
        },
        conta: {
          email,
          senha, // Em produção: nunca envie senha pura; use hashing no backend.
        },
      };

      console.log("Dados válidos:", payload);
      Alert.alert("Sucesso!", "Formulário enviado com sucesso.");

      // Reset
      setNome("");
      setDataNasc("");
      setCpf("");
      setTelFixo("");
      setCel("");
      setPai("");
      setMae("");
      setCep("");
      setEndereco("");
      setNumero("");
      setComplemento("");
      setCidade("");
      setEstado("");
      setEmail("");
      setSenha("");
      setSenha2("");
      setErrors({});
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Erro inesperado",
        "Ocorreu um erro ao enviar. Tente novamente."
      );
    }
  };

  /** Helper de estilo de input com erro */
  const inputStyle = (field) => [
    globalStyles.input,
    errors[field] ? globalStyles.inputError : null,
  ];

  return (
    <View style={globalStyles.container}>
      <ScrollView style={globalStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={globalStyles.title}>Cadastro</Text>

        {/* =======================
            1) INFORMAÇÕES PESSOAIS
            ======================= */}
        <Text style={globalStyles.sectionTitle}>Informações Pessoais</Text>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("nome")}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={(t) => setField("nome", t)}
            autoCapitalize="words"
          />
          {!!errors.nome && <Text style={globalStyles.errorText}>{errors.nome}</Text>}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("dataNasc")}
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            value={dataNasc}
            onChangeText={(t) => setField("dataNasc", t)}
            keyboardType="number-pad"
            maxLength={10}
          />
          {!!errors.dataNasc && <Text style={globalStyles.errorText}>{errors.dataNasc}</Text>}
          {idade !== null && !errors.dataNasc && (
            <Text style={{ marginTop: 4 }}>Idade: {idade} anos</Text>
          )}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("cpf")}
            placeholder="CPF (XXX.XXX.XXX-XX)"
            value={cpf}
            onChangeText={(t) => setField("cpf", t)}
            keyboardType="number-pad"
            maxLength={14}
          />
          {!!errors.cpf && <Text style={globalStyles.errorText}>{errors.cpf}</Text>}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("telFixo")}
            placeholder="Telefone Fixo (ex.: (11) 2345-6789)"
            value={telFixo}
            onChangeText={(t) => setField("telFixo", t)}
            keyboardType="number-pad"
            maxLength={14}
          />
          {!!errors.telFixo && <Text style={globalStyles.errorText}>{errors.telFixo}</Text>}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("cel")}
            placeholder="Celular (ex.: (11) 91234-5678)"
            value={cel}
            onChangeText={(t) => setField("cel", t)}
            keyboardType="number-pad"
            maxLength={15}
          />
          {!!errors.cel && <Text style={globalStyles.errorText}>{errors.cel}</Text>}
        </View>

        {/* Campos complementares se menor */}
        {isMenor && (
          <>
            <Text style={globalStyles.sectionTitle}>Informações Complementares (Menores)</Text>

            <View style={globalStyles.inputContainer}>
              <TextInput
                style={inputStyle("pai")}
                placeholder="Nome do Pai"
                value={pai}
                onChangeText={(t) => setField("pai", t)}
                autoCapitalize="words"
              />
              {!!errors.pai && <Text style={globalStyles.errorText}>{errors.pai}</Text>}
            </View>

            <View style={globalStyles.inputContainer}>
              <TextInput
                style={inputStyle("mae")}
                placeholder="Nome da Mãe"
                value={mae}
                onChangeText={(t) => setField("mae", t)}
                autoCapitalize="words"
              />
              {!!errors.mae && <Text style={globalStyles.errorText}>{errors.mae}</Text>}
            </View>
          </>
        )}

        {/* =======================
            2) ENDEREÇO
            ======================= */}
        <Text style={globalStyles.sectionTitle}>Endereço</Text>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("cep")}
            placeholder="CEP (XXXXX-XXX)"
            value={cep}
            onChangeText={(t) => setField("cep", t)}
            keyboardType="number-pad"
            maxLength={9}
          />
          {!!errors.cep && <Text style={globalStyles.errorText}>{errors.cep}</Text>}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("endereco")}
            placeholder="Endereço"
            value={endereco}
            onChangeText={(t) => setField("endereco", t)}
          />
          {!!errors.endereco && <Text style={globalStyles.errorText}>{errors.endereco}</Text>}
        </View>

        <View style={globalStyles.inputRow}>
          <View style={[globalStyles.inputContainer, { flex: 1 }]}>
            <TextInput
              style={inputStyle("numero")}
              placeholder="Número"
              value={numero}
              onChangeText={(t) => setField("numero", t)}
              keyboardType="default"
            />
            {!!errors.numero && <Text style={globalStyles.errorText}>{errors.numero}</Text>}
          </View>
          <View style={[globalStyles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <TextInput
              style={globalStyles.input}
              placeholder="Complemento (opcional)"
              value={complemento}
              onChangeText={(t) => setField("complemento", t)}
            />
          </View>
        </View>

        <View style={globalStyles.inputRow}>
          <View style={[globalStyles.inputContainer, { flex: 2 }]}>
            <TextInput
              style={inputStyle("cidade")}
              placeholder="Cidade"
              value={cidade}
              onChangeText={(t) => setField("cidade", t)}
            />
            {!!errors.cidade && <Text style={globalStyles.errorText}>{errors.cidade}</Text>}
          </View>
          <View style={[globalStyles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <TextInput
              style={inputStyle("estado")}
              placeholder="UF"
              value={estado}
              onChangeText={(t) => setField("estado", t)}
              maxLength={2}
              autoCapitalize="characters"
            />
            {!!errors.estado && <Text style={globalStyles.errorText}>{errors.estado}</Text>}
          </View>
        </View>

        {/* =======================
            3) INFORMAÇÕES DA CONTA
            ======================= */}
        <Text style={globalStyles.sectionTitle}>Informações da Conta</Text>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("email")}
            placeholder="Email"
            value={email}
            onChangeText={(t) => setField("email", t)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {!!errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("senha")}
            placeholder="Senha"
            value={senha}
            onChangeText={(t) => setField("senha", t)}
            secureTextEntry
          />
          {!!errors.senha && <Text style={globalStyles.errorText}>{errors.senha}</Text>}
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={inputStyle("senha2")}
            placeholder="Confirmar Senha"
            value={senha2}
            onChangeText={(t) => setField("senha2", t)}
            secureTextEntry
          />
          {!!errors.senha2 && <Text style={globalStyles.errorText}>{errors.senha2}</Text>}
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
          <Text style={globalStyles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}