import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { CustomerInfo } from 'react-native-purchases';
import { Api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your RevenueCat API keys
const APIKeys = {
	apple: '',
	google: 'goog_JFagyunxibxTYqMNcpsrtlIsyJH'
};

interface RevenueCatProps {
	purchasePackage?: (pack: PurchasesPackage) => Promise<void>;
	restorePermissions?: () => Promise<CustomerInfo>;
	user: UserState;
	packages: PurchasesPackage[];
}

export interface UserState {
	cookies: number;
	items: string[];
	pro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const useRevenueCat = () => {
	return useContext(RevenueCatContext) as RevenueCatProps;
};

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }: any) => {
	const [user, setUser] = useState<UserState>({ cookies: 0, items: [], pro: false });
	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const init = async () => {
			if (Platform.OS === 'android') {
				await Purchases.configure({ apiKey: APIKeys.google });
			} else {
				await Purchases.configure({ apiKey: APIKeys.apple });
			}
			setIsReady(true);

			// Use more logging during debug if want!
			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			// Listen for customer updates
			Purchases.addCustomerInfoUpdateListener(async (info) => {
				updateCustomerInformation(info);
			});

			// Load all offerings and the user object with entitlements
			await loadOfferings();
		};
		init();
	}, []);

	// Load all offerings a user can (currently) purchase
	const loadOfferings = async () => {
		const offerings = await Purchases.getOfferings();
		if (offerings.current) {
			setPackages(offerings.current.availablePackages);
		}
	};

	// Update user state based on previous purchases
	const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
		const newUser: UserState = { cookies: user.cookies, items: [], pro: false };

		if (customerInfo?.entitlements.active['Epic Wand'] !== undefined) {
			newUser.items.push(customerInfo?.entitlements.active['Epic Wand'].identifier);
		}

		if (customerInfo?.entitlements.active['Magic Boots'] !== undefined) {
			newUser.items.push(customerInfo?.entitlements.active['Magic Boots'].identifier);
		}

		if (customerInfo?.entitlements.active['PRO Features'] !== undefined) {
			newUser.pro = true;
		}

		setUser(newUser);
	};

	async function getUserId() {
        const storageIMEI = await AsyncStorage.getItem('@IMEI')
        let handleStorageIMEI = JSON.parse(storageIMEI || '{}')

        try {
            await Api.post('/api/index.php?request=users&action=return', {
                IMEI: handleStorageIMEI
            }).then(async response => {
				handlePremiun(response)
            }).catch((err) => {
                console.log('erro', err)
            })
        } catch (err) {
            console.log('erro', err)
        }
    }

	async function handlePremiun(response) {
		console.log(response)
		try {
			await Api.post('/api/index.php?request=users&action=upgrade-premium', {
				user_id: response.data.data.usuario_id
			}).then(response => {
				console.log(response.data)
			}).catch((err) => {
				console.log('erro', err)
			})
		} catch (err) {
			console.log('erro', err)
		}
	}

	// Purchase a package
	const purchasePackage = async (pack: PurchasesPackage) => {
		try {
			await Purchases.purchasePackage(pack);
			getUserId()

			// Directly add our consumable product
			if (pack.product.identifier === 'rca_299_consume') {
				setUser({ ...user, cookies: (user.cookies += 5) });
			}
		} catch (e: any) {
			if (!e.userCancelled) {
				alert(e);
			}
		}
	};

	// // Restore previous purchases
	const restorePermissions = async () => {
		const customer = await Purchases.restorePurchases();
		return customer;
	};

	const value = {
		restorePermissions,
		user,
		packages,
		purchasePackage
	};

	// Return empty fragment if provider is not ready (Purchase not yet initialised)
	if (!isReady) return <></>;

	return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};

