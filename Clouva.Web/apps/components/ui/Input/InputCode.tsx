import { useRef } from 'react';

const CODE_LENGTH = 6;

interface InputCodeProps {
	value: string;
	onChange: (code: string) => void;
	onComplete?: (code: string) => void;
	success?: boolean;
	error?: boolean;
}

const InputCode: React.FC<InputCodeProps> = ({ value, onChange, onComplete, success, error }) => {
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

	const codeArray = value.split('').concat(Array(CODE_LENGTH).fill('')).slice(0, CODE_LENGTH);

	const focusInput = (index: number) => inputsRef.current[index]?.focus();

	const handleChange = (v: string, index: number) => {
		if (!v) return;

		const newCodeArray = codeArray.map((c, i) => (i === index ? v.slice(-1) : c));

		const newCode = newCodeArray.join('');
		onChange(newCode);

		if (index < CODE_LENGTH - 1) {
			focusInput(index + 1);
		}

		if (newCodeArray.every((c) => c !== '')) {
			onComplete?.(newCode);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === 'Backspace') {
			e.preventDefault();

			let newCodeArray = codeArray.slice();
			if (newCodeArray[index]) {
				newCodeArray[index] = '';
			} else if (index > 0) {
				newCodeArray[index - 1] = '';
				focusInput(index - 1);
			}

			onChange(newCodeArray.join(''));
		}
	};

	return (
		<div className="flex gap-2 justify-center">
			{codeArray.map((v, idx) => (
				<input
					key={idx}
					ref={(el) => {
						inputsRef.current[idx] = el;
					}}
					value={v}
					onChange={(e) => handleChange(e.target.value, idx)}
					onKeyDown={(e) => handleKeyDown(e, idx)}
					className={`w-12 h-12 text-center text-xl border rounded-md transition-colors ${success ? 'border-green-500 hover:border-green-500' : error ? 'border-red-500 hover:border-red-500' : 'border-[#ccc]'}`}
					inputMode="numeric"
					maxLength={1}
				/>
			))}
		</div>
	);
};

export default InputCode;
