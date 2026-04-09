import { useState } from "react";
import { useOS } from "../../context/useOS";
import Icon from "../../components/ui/Icon";
import styles from "./Settings.module.css";

const panels = [
  { id: "network", label: "Réseau", icon: "wifi" },
  { id: "sound", label: "Son", icon: "volume-high" },
  { id: "display", label: "Affichage", icon: "brightness" },
  { id: "bluetooth", label: "Bluetooth", icon: "bluetooth" },
  { id: "about", label: "À propos", icon: "info" },
];

function NetworkPanel({ system, updateSystem }) {
  return (
    <div className={styles.panel}>
      <h3>Wi-Fi</h3>
      <div className={styles.settingRow}>
        <span>Wi-Fi</span>
        <button
          className={`${styles.toggle} ${system.wifi ? styles.active : ""}`}
          onClick={() => updateSystem("wifi", !system.wifi)}
        >
          <div className={styles.toggleThumb} />
        </button>
      </div>
      {system.wifi && (
        <div className={styles.networkList}>
          {["HomeNetwork", "Office_5G", "CafeWifi", "Neighbor_Net"].map(
            (name) => (
              <div key={name} className={styles.networkItem}>
                <Icon name="wifi" size={16} />
                <span>{name}</span>
                {name === "HomeNetwork" && (
                  <span className={styles.connected}>Connecté</span>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function SoundPanel({ system, updateSystem }) {
  return (
    <div className={styles.panel}>
      <h3>Son</h3>
      <div className={styles.settingRow}>
        <Icon
          name={system.volume > 0 ? "volume-high" : "volume-mute"}
          size={18}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={system.volume}
          onChange={(e) => updateSystem("volume", Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.value}>{system.volume}%</span>
      </div>
    </div>
  );
}

function DisplayPanel({ system, updateSystem }) {
  return (
    <div className={styles.panel}>
      <h3>Affichage</h3>
      <div className={styles.settingRow}>
        <Icon name="brightness" size={18} />
        <input
          type="range"
          min="10"
          max="100"
          value={system.brightness}
          onChange={(e) => updateSystem("brightness", Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.value}>{system.brightness}%</span>
      </div>
    </div>
  );
}

function BluetoothPanel({ system, updateSystem }) {
  return (
    <div className={styles.panel}>
      <h3>Bluetooth</h3>
      <div className={styles.settingRow}>
        <span>Bluetooth</span>
        <button
          className={`${styles.toggle} ${system.bluetooth ? styles.active : ""}`}
          onClick={() => updateSystem("bluetooth", !system.bluetooth)}
        >
          <div className={styles.toggleThumb} />
        </button>
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className={styles.panel}>
      <h3>À propos</h3>
      <div className={styles.aboutGrid}>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Nom de l'appareil</span>
          <span>osint-desktop</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Système</span>
          <span>Ubuntu 24.04 LTS</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Noyau</span>
          <span>Linux 6.5.0-generic</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Processeur</span>
          <span>Intel Core i7-12700H</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Mémoire</span>
          <span>16 Go</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Disque</span>
          <span>512 Go SSD</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>Carte graphique</span>
          <span>NVIDIA RTX 3060</span>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activePanel, setActivePanel] = useState("network");
  const { system, updateSystem } = useOS();

  const renderPanel = () => {
    switch (activePanel) {
      case "network":
        return <NetworkPanel system={system} updateSystem={updateSystem} />;
      case "sound":
        return <SoundPanel system={system} updateSystem={updateSystem} />;
      case "display":
        return <DisplayPanel system={system} updateSystem={updateSystem} />;
      case "bluetooth":
        return <BluetoothPanel system={system} updateSystem={updateSystem} />;
      case "about":
        return <AboutPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.settings}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Paramètres</div>
        {panels.map((p) => (
          <button
            key={p.id}
            className={`${styles.sidebarItem} ${activePanel === p.id ? styles.active : ""}`}
            onClick={() => setActivePanel(p.id)}
          >
            <Icon name={p.icon} size={16} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.content}>{renderPanel()}</div>
    </div>
  );
}
