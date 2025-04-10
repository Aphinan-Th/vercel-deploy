import { DrawDetail } from "@/app/diagnosis/model/type";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClickItem: (detail: DrawDetail) => void;
    onClose: () => void;
    content: DrawDetail[],
}

const DialogListContent: React.FC<ModalProps> = ({ isOpen, onClose, content, onClickItem }) => {
    if (!isOpen) return null;
    return (
        <>
            <div id="default-modal" className="overflow-y-auto overflow-x-hidden flex fixed z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-black bg-opacity-40">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Edit Point
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={onClose}>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            {content.map((detail) => <Item key={detail.pointName} detail={detail} onClickButton={(drawDetail: DrawDetail) => onClickItem(drawDetail)} />)}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

const Item = ({ detail, onClickButton }: { detail: DrawDetail, onClickButton: (detail: DrawDetail) => void }) => (
    <>
        <nav className="flex min-w-[240px] flex-col gap-1">
            <div
                role="button"
                className="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            >
                Point: {detail.pointName}
                <div className="ml-auto grid place-items-center justify-self-end">
                    <Button
                        variant="ghost"
                        className="rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        onClick={() => onClickButton(detail)}>
                        <Pencil width="24" height="24" />
                    </Button>
                </div>
            </div>
        </nav>
    </>
);

export default DialogListContent;