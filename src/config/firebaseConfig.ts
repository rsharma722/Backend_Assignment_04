import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

import serviceAccount from "../firebase-service-account.json";

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const auth: Auth = getAuth();
