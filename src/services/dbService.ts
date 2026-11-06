import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  MenuItem,
  Category,
  Order,
  OrderStatus,
  Enquiry,
  GalleryItem,
  WebsiteSettings,
  Review,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
} from '../data/initialData';

// Collection references
const MENU_COLLECTION = 'menuItems';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';
const ENQUIRIES_COLLECTION = 'enquiries';
const GALLERY_COLLECTION = 'gallery';
const SETTINGS_COLLECTION = 'websiteSettings';
const SETTINGS_DOC_ID = 'default';
const REVIEWS_COLLECTION = 'reviews';

/**
 * Seed initial restaurant data into Firestore if empty
 */
export async function seedInitialDataIfNeeded(): Promise<boolean> {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      // Seed Settings
      await setDoc(settingsRef, {
        ...INITIAL_SETTINGS,
        updatedAt: new Date().toISOString(),
      });

      // Seed Categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), {
          ...cat,
          createdAt: new Date().toISOString(),
        });
      }

      // Seed Menu Items
      for (const item of INITIAL_MENU_ITEMS) {
        await setDoc(doc(db, MENU_COLLECTION, item.id), {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Seed Gallery
      for (const gal of INITIAL_GALLERY) {
        await setDoc(doc(db, GALLERY_COLLECTION, gal.id), {
          ...gal,
          createdAt: new Date().toISOString(),
        });
      }

      // Seed Reviews
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, REVIEWS_COLLECTION, rev.id), {
          ...rev,
          createdAt: new Date().toISOString(),
        });
      }

      console.log('Burger Bite initial database seed completed successfully!');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Seeding check note:', error);
    return false;
  }
}

// ----------------------------------------------------
// Realtime Subscriptions
// ----------------------------------------------------

export function subscribeToSettings(
  onData: (settings: WebsiteSettings) => void,
  onError?: (err: Error) => void
) {
  const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    settingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as WebsiteSettings);
      } else {
        onData(INITIAL_SETTINGS);
      }
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, SETTINGS_COLLECTION);
    }
  );
}

export function subscribeToMenuItems(
  onData: (items: MenuItem[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, MENU_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_MENU_ITEMS);
      } else {
        const items: MenuItem[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        onData(items);
      }
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, MENU_COLLECTION);
    }
  );
}

export function subscribeToCategories(
  onData: (categories: Category[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_CATEGORIES);
      } else {
        const cats: Category[] = [];
        snapshot.forEach((doc) => {
          cats.push({ id: doc.id, ...doc.data() } as Category);
        });
        cats.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        onData(cats);
      }
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, CATEGORIES_COLLECTION);
    }
  );
}

export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(orders);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
    }
  );
}

export function subscribeToEnquiries(
  onData: (enquiries: Enquiry[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, ENQUIRIES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Enquiry[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Enquiry);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(list);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, ENQUIRIES_COLLECTION);
    }
  );
}

export function subscribeToGallery(
  onData: (items: GalleryItem[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, GALLERY_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_GALLERY);
      } else {
        const items: GalleryItem[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as GalleryItem);
        });
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        onData(items);
      }
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, GALLERY_COLLECTION);
    }
  );
}

export function subscribeToReviews(
  onData: (reviews: Review[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, REVIEWS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_REVIEWS);
      } else {
        const list: Review[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Review);
        });
        onData(list);
      }
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.LIST, REVIEWS_COLLECTION);
    }
  );
}

// ----------------------------------------------------
// Mutations: Menu Items
// ----------------------------------------------------

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, MENU_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, MENU_COLLECTION);
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${MENU_COLLECTION}/${id}`);
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${MENU_COLLECTION}/${id}`);
  }
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean): Promise<void> {
  return updateMenuItem(id, { isAvailable });
}

export async function toggleMenuItemFeatured(id: string, isFeatured: boolean): Promise<void> {
  return updateMenuItem(id, { isFeatured });
}

// ----------------------------------------------------
// Mutations: Categories
// ----------------------------------------------------

export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...category,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, CATEGORIES_COLLECTION);
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CATEGORIES_COLLECTION}/${id}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
  }
}

// ----------------------------------------------------
// Mutations: Orders
// ----------------------------------------------------

export async function placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const newOrder = {
      ...orderData,
      status: 'New' as OrderStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(colRef, newOrder);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${id}`);
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ORDERS_COLLECTION}/${id}`);
  }
}

// ----------------------------------------------------
// Mutations: Enquiries
// ----------------------------------------------------

export async function submitCustomerEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const colRef = collection(db, ENQUIRIES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...enquiry,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ENQUIRIES_COLLECTION);
  }
}

export async function updateEnquiryStatus(id: string, status: 'unread' | 'read'): Promise<void> {
  try {
    const docRef = doc(db, ENQUIRIES_COLLECTION, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ENQUIRIES_COLLECTION}/${id}`);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  try {
    const docRef = doc(db, ENQUIRIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ENQUIRIES_COLLECTION}/${id}`);
  }
}

// ----------------------------------------------------
// Mutations: Gallery
// ----------------------------------------------------

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, GALLERY_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, GALLERY_COLLECTION);
  }
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<void> {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${GALLERY_COLLECTION}/${id}`);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GALLERY_COLLECTION}/${id}`);
  }
}

// ----------------------------------------------------
// Mutations: Website Settings
// ----------------------------------------------------

export async function saveWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`);
  }
}

// ----------------------------------------------------
// Mutations: Reviews
// ----------------------------------------------------

export async function submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...review,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, REVIEWS_COLLECTION);
  }
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${REVIEWS_COLLECTION}/${id}`);
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${REVIEWS_COLLECTION}/${id}`);
  }
}
