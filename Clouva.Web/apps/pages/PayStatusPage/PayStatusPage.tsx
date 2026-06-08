import { useEffect, useState } from "react"
import { ROUTES } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import Check from "@/components/@icons/check"
import Close from "@/components/@icons/close"

const PayStatusPage = () => {
    const { t } = useTranslation();

    const [intro, setIntro] = useState(true)
    const [pulse, setPulse] = useState(false)
    const [introExit, setIntroExit] = useState(false)

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get('payment_id')?.trim();

    useEffect(() => {
        if (!paymentId) {
            navigate(ROUTES.HOME, { replace: true });
            return;
        }

    }, [paymentId, navigate]);

    useEffect(() => {
        const pulseTimer = setTimeout(() => {
            setPulse(true)
        }, 550)

        const exitTimer = setTimeout(() => {
            setIntroExit(true)
        }, 400)

        const removeTimer = setTimeout(() => {
            setIntro(false)
        }, 400)

        return () => {
            clearTimeout(pulseTimer)
            clearTimeout(exitTimer)
            clearTimeout(removeTimer)
        }
    }, [])

    return (
        <main className="p-[1rem]">
            <Link to={ROUTES.HOME} className="flex justify-end mb-3 md:fixed top-8 right-8">
                <div className="text-[#000] bg-[transparent] hover:bg-[#e5e7eb] rounded-[8px] p-[9px] cursor-pointer text-[1.1rem]">
                    <Close fill="#000" size={19} />
                </div>
            </Link>

            {intro && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className={`intro-circle ${introExit ? "fade-out" : "expand"}`} />
                </div>
            )}

            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="flex flex-col space-y-[4rem] items-center max-w-[400px]">
                    <div className="flex justify-center">
                        <div className="bg-[#daf2ea] rounded-full p-4">
                            <div className={`bg-[#15bd80] rounded-full p-5 ${pulse ? "animate-pulseOnce" : "scale-0 opacity-0"}`}>
                                <Check fill="#fff" size={41} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 text-center">
                        <h2 className="text-xl font-medium">{t("message.payment-successful")}</h2>
                        <p className="text-[#777] text-[15px]">
                            {t("message.success-paid-desc")}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-2 text-[15px] w-full">
                        <Link to={ROUTES.HOME} className="bg-[#15bd80] hover:bg-[#35c390] text-white text-center py-2 rounded-md w-full">
                            {t("label.continue")}
                        </Link>

                        <Link to={ROUTES.CLOUVA_SETTINGs} className="bg-[#eee] text-[15px] text-center py-2 rounded-md w-full">
                            {t("label.settings-title")}
                        </Link>
                    </div>
                </div>
            </div>
        </main >
    )
}

export default PayStatusPage
