"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, User, Lock, Camera, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import userService from "@/services/user.service"
import profileService from "@/services/profile.service"
import type { UserUpdate } from "@/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

// Helper pour construire l'URL complète de l'avatar
const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
  if (!avatarPath) return null;
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  // Sinon, préfixer avec l'URL de base de l'API
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${avatarPath}`;
};

const profileSchema = z.object({
  full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse email invalide."),
  phone_number: z.string().optional(),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, "Le mot de passe actuel est requis."),
  new_password: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères."),
  confirm_password: z.string().min(8, "La confirmation doit contenir au moins 8 caractères."),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

const Settings = () => {
  const { user, updateUser: updateAuthUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Initialiser l'image de profil depuis l'utilisateur
  useEffect(() => {
    // avatar_url n'est pas encore dans le type User - sera ajouté quand l'API le supportera
    const userWithAvatar = user as (typeof user & { avatar_url?: string }) | null
    if (userWithAvatar?.avatar_url) {
      setProfileImage(getAvatarUrl(userWithAvatar.avatar_url))
    }
  }, [user])

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: UserUpdate) => userService.updateUser(user!.id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      if (updateAuthUser && response.data) {
        updateAuthUser(response.data);
      }
      toast({
        title: "Succès",
        description: "Vos informations ont été mises à jour.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        type: "error",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      profileService.changePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      passwordForm.reset();
      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié.",
      });
    },
    onError: (error: { detail?: string }) => {
      const message = error?.detail || "Une erreur est survenue lors du changement de mot de passe.";
      toast({
        title: "Erreur",
        description: message === "Incorrect password"
          ? "Le mot de passe actuel est incorrect."
          : message === "New password must be different from current password"
            ? "Le nouveau mot de passe doit être différent de l'ancien."
            : message,
        type: "error",
      });
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => profileService.deleteAvatar(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setProfileImage(null);
      toast({
        title: "Succès",
        description: "Votre photo de profil a été supprimée.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la photo.",
        type: "error",
      });
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    updateUserMutation.mutate({
      full_name: values.full_name,
      email: values.email,
      phone_number: values.phone_number || null,
    });
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    changePasswordMutation.mutate({
      current_password: values.current_password,
      new_password: values.new_password,
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image.",
        type: "error",
      });
      return;
    }

    // Vérifier la taille (max 10MB comme défini dans le backend)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 10 Mo.",
        type: "error",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const response = await profileService.uploadAvatar(user.id, file);
      setProfileImage(getAvatarUrl(response.avatar_url));
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de la photo.",
        type: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = () => {
    if (profileImage) {
      deleteAvatarMutation.mutate();
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Mot de passe", icon: Lock },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Mon Profil</h1>
        <p className="text-accent">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu des onglets */}
        <div className="lg:col-span-1">
          <div className="card space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id ? "bg-primary text-white" : "text-secondary hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Informations personnelles</h2>

                {/* Photo de profil */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                      {isUploadingAvatar ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : profileImage ? (
                        <img
                          src={profileImage}
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      title="Changer la photo de profil"
                      aria-label="Changer la photo de profil"
                    >
                      <Camera className="w-4 h-4 text-secondary" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Upload en cours...
                          </>
                        ) : (
                          "Changer la photo"
                        )}
                      </Button>
                      {profileImage && (
                        <Button
                          variant="outline"
                          onClick={handleDeleteAvatar}
                          disabled={deleteAvatarMutation.isPending || isUploadingAvatar}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Supprimer la photo"
                          aria-label="Supprimer la photo de profil"
                        >
                          {deleteAvatarMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-accent">JPG, PNG, GIF ou WebP. Max 10 Mo.</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Sélectionner une photo de profil"
                    title="Sélectionner une photo de profil"
                  />
                </div>

                {/* Formulaire des informations */}
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean Dupont" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse email</FormLabel>
                          <FormControl>
                            <Input placeholder="jean.dupont@exemple.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+243 xxx xxx xxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="btn-primary flex items-center gap-2"
                      disabled={updateUserMutation.isPending}
                    >
                      {updateUserMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Enregistrer les modifications
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Changer le mot de passe</h2>

                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="btn-primary flex items-center gap-2"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Changer le mot de passe
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
