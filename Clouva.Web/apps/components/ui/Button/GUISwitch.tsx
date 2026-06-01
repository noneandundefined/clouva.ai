interface GUISwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const GUISwitch: React.FC<GUISwitchProps> = ({ className, ...props }) => {
	return <input type="checkbox" role="switch" className={`check-custom ${className || ''}`} {...props} />;
};

export default GUISwitch;
