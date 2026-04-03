export const PERMISSIONS = {
  viewer: {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  },
  admin: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
