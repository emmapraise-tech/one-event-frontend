import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import { CreateVendorData, Vendor } from '@/types/vendor';
import { useAuth } from './useAuth';

export function useVendors() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: vendorService.findAll,
  });

  const createVendorMutation = useMutation({
    mutationFn: vendorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  // Get current user's vendor profile
  const vendor = vendors?.find((v) => v.userId === user?.id);

  return {
    vendors,
    vendor,
    isLoading,
    error,
    createVendor: createVendorMutation.mutate,
    isCreating: createVendorMutation.isPending,
  };
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorService.findOne(id),
    enabled: !!id,
  });
}

