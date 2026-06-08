import React from "react"
import PayStatusPage from "./PayStatusPage"
import { ROUTES } from "@/constants/constants"
import PageMeta from "@/components/PageMeta/PageMeta"

const IPayStatusPage = () => {
    return (
        <React.Fragment>
            <PageMeta page="PayStatus" path={ROUTES.PAY_STATUS} />

            <PayStatusPage />
        </React.Fragment>
    )
}

export default IPayStatusPage
