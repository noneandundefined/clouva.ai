import { useEffect, useState } from 'react';

interface WaveAnimationProps {
	level: number;
}

const BAR_COUNT = 7;
const MIN_HEIGHT = 8;
const MAX_HEIGHT = 46;

const WaveAnimation: React.FC<WaveAnimationProps> = ({ level }) => {
	const [phase, setPhase] = useState(0);

	useEffect(() => {
		let rafId = 0;
		const animate = (time: number) => {
			setPhase(time / 120);
			rafId = requestAnimationFrame(animate);
		};

		rafId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafId);
	}, []);

	const energy = Math.min(100, level * 1.35 + 18);

	return (
		<div className="flex items-end justify-center gap-[5px] h-[50px]">
			{Array.from({ length: BAR_COUNT }, (_, index) => {
				const wave = Math.sin(phase + index * 0.85) * 0.5 + 0.5;
				const barWeight = 0.75 + (index % 3) * 0.18;
				const height = MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * (energy / 100) * barWeight * (0.35 + wave * 0.65);

				return <div key={index} className="w-[4px] bg-white rounded-full transition-[height] duration-75 ease-out" style={{ height: `${height}px` }} />;
			})}
		</div>
	);
};

export default WaveAnimation;
