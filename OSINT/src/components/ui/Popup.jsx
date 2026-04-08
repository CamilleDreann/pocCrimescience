import Icon from "./Icon";
import styles from "./Popup.module.css";

const TYPE_ICONS = {
  error: "close",
  warning: "info",
  success: "check",
  info: "info",
};

const TYPE_COLORS = {
  error: "var(--color-danger, #e5534b)",
  warning: "var(--color-warning, #f0ad4e)",
  success: "var(--color-success, #3fb950)",
  info: "var(--color-accent, #d85E33)",
};

export default function Popup({
  title,
  message,
  type = "info",
  onClose,
  actions,
}) {
  const accentAttr = {
    style: { "--popup-accent": TYPE_COLORS[type] || TYPE_COLORS.info },
  };

  return (
    <div className={styles.overlay} onClick={onClose} {...accentAttr}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Icon
              name={TYPE_ICONS[type] || "info"}
              size={20}
              color="currentColor"
            />
            <span>{title}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon name="close" size={16} color="currentColor" />
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.message}>{message}</p>

          <div className={styles.actions}>
            {actions ? (
              actions.map((action, i) => (
                <button
                  key={i}
                  className={`${styles.btn} ${action.primary ? styles.btnPrimary : styles.btnSecondary}`}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))
            ) : (
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={onClose}
              >
                Compris
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
