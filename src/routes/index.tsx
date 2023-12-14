import React from "react";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

function Routes() {
    const loading = false
    const isAuthenticated = true

    return (
        isAuthenticated ? <AppRoutes /> : <AuthRoutes />
    )
}

export default Routes;