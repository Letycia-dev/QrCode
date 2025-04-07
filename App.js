import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Linking } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {

  const [temPermissao, setTemPermissao] = useState(null);

  const [digitalizado, setDigitalizado] = useState(false);

  const [dados, setDados] = useState(null);

  useEffect(() => {

    const obterPermissoesDaCamera = async () => {

      const { status } = await Camera.requestCameraPermissionsAsync();

      setTemPermissao(status === "granted");

    }

    obterPermissoesDaCamera();

  }, []);

  const lidarComCodigoDigitalizado = ({ type, data }) => {

    setDigitalizado(true)

    setDados(data);

    alert(`Codigo de barras do tipo ${type} e dados ${data} foram digitalizados!`)

  }

  const abrirLink = () => {

    Linking.openURL(dados)
  }

  if (temPermissao === null) {

    return <Text>Solicitndo permissão para usar a câmera</Text>;
  }

  if (temPermissao === false) {

    return <Text>Sem acesso á câmera</Text>;
  }

  return (
    <View>

      <CameraView onBarcodeScanned={digitalizado ? undefined : lidarComCodigoDigitalizado}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417'], }}
                  style={StyleSheet.absoluteFillObject} />

      <MaterialCommunityIcons name="qrcode-scan" size={100}
                              color='orange' style={styles.icone} />

      <Text style={styles.titulo}>Leitor de QR Code</Text>

      {digitalizado &&

        (
          <Button color='orange' title={"Toque para digitalizar novamente"}
            onPress={() => { setDigitalizado(false) }} />
        )

      }

      {digitalizado &&

        <View style={styles.segBotao}>

          <Button color='orange' title={'Abrir link: ' + dados} onPress={abrirLink} />

        </View>

      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  cameraContainer: {
    flex: 1, // A câmera ocupa todo o espaço disponível
    position: "absolute", // Fixando a câmera atrás dos outros componentes
    width: "100%",
    height: "100%",
  },
  camera: {
    ...StyleSheet.absoluteFillObject, // Deixa a câmera ocupar toda a tela
  },
  icone: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "darkorange",
    textAlign: "center",
  },
  segBotao: {
    marginTop: 15,
  },
});