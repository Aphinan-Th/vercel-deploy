"use client"

interface ButtonIconProps {
    IconComponent: React.FC<React.SVGProps<SVGSVGElement>>,
    contentDescription: string,
    onClick: () => void
}

const ButtonIcon: React.FC<ButtonIconProps> = ({IconComponent, onClick }) => {
    return (
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={onClick}>
            <IconComponent width={36} height={36}/>
        </button>
    );
};

export default ButtonIcon;