import { FaBook, FaPen, FaCode, FaSquareRootAlt, FaGraduationCap, FaCalculator, FaMicroscope, FaBrain } from 'react-icons/fa';
import { GiAtom } from 'react-icons/gi';

const FloatingIcons = () => {
    const icons = [
        { Icon: FaBook, offset: '0%', left: '10%', top: '20%', color: '#FF6B6B', size: 50, rotation: 15, duration: 3.5 },
        { Icon: FaPen, offset: '25%', left: '80%', top: '20%', color: '#4ECDC4', size: 30, rotation: -10, duration: 4.2 },
        { Icon: FaCode, offset: '50%', left: '15%', top: '70%', color: '#45B7D1', size: 60, rotation: 5, duration: 3.8 },
        { Icon: FaSquareRootAlt, offset: '75%', left: '80%', top: '80%', color: '#96CEB4', size: 55, rotation: -15, duration: 4.5 },
        { Icon: FaGraduationCap, offset: '12.5%', left: '90%', top: '55%', color: '#9D65C9', size: 40, rotation: 20, duration: 3.2 },
        { Icon: FaCalculator, offset: '62.5%', left: '5%', top: '40%', color: '#FFBE0B', size: 35, rotation: -5, duration: 4.8 },
        { Icon: GiAtom, offset: '37.5%', left: '80%', top: '40%', color: '#2EC4B6', size: 70, rotation: -8, duration: 4 },
        { Icon: FaBrain, offset: '87.5%', left: '15%', top: '45%', color: '#FF69B4', size: 48, rotation: 18, duration: 3.6 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(var(--rotation)); }
                        50% { transform: translateY(-10px) rotate(var(--rotation)); }
                        100% { transform: translateY(0px) rotate(var(--rotation)); }
                    }
                `}
            </style>
            {icons.map(({ Icon, offset, left, top, color, size, rotation, duration }, index) => (
                <div
                    key={index}
                    className="absolute transition-all"
                    style={{
                        left,
                        top,
                        color: color,
                        '--rotation': `${rotation}deg`,
                        animation: `float ${duration}s ease-in-out infinite`,
                        transform: `translateY(calc(-10px * ${offset.replace('%', '') / 100}))`,
                    }}
                >
                    <Icon size={size} />
                </div>
            ))}
        </div>
    );
};

export default FloatingIcons;
