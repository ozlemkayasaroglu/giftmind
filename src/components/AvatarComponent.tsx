import React, { useState } from "react";
import { railwayApi } from "../lib/railwayApi";

export const AvatarDisplay: React.FC<{
  avatarUrl?: string | null;
  size?: number;
  alt?: string;
  className?: string;
}> = ({ avatarUrl, size = 100, alt = "Avatar", className = "" }) => {
  const dimension = `${size}px`;
  return (
    <div
      className={`overflow-hidden rounded-xl border flex items-center justify-center bg-white/5 ${className}`}
      style={{
        width: dimension,
        height: dimension,
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
          No Avatar
        </span>
      )}
    </div>
  );
};

export const AvatarUpload: React.FC<{
  personaId: string;
  currentAvatarUrl?: string | null;
  onAvatarChange?: (newUrl: string | null) => void;
  className?: string;
}> = ({ personaId, currentAvatarUrl, onAvatarChange, className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await railwayApi.uploadPersonaAvatar(personaId, file);
      console.log("AvatarUpload result:", res);
      const url =
        (res as any)?.data?.avatar_url || (res as any)?.avatar_url || null;
      onAvatarChange?.(url);
    } catch (err) {
      console.error("Avatar upload failed", err);
      onAvatarChange?.(currentAvatarUrl ?? null);
    } finally {
      setUploading(false);
    }
  };

  const onRemove = async () => {
    setRemoving(true);
    try {
      const res = await railwayApi.removePersonaAvatar(personaId);
      console.log("AvatarRemove result:", res);
      onAvatarChange?.(null);
    } catch (err) {
      console.error("Avatar remove failed", err);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className={className}>
      <label
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white cursor-pointer"
        style={{ backgroundColor: "var(--gm-primary)" }}
      >
        {uploading ? "Yükleniyor…" : "Avatar Yükle"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onSelect}
          disabled={uploading}
        />
      </label>
      {currentAvatarUrl && (
        <button
          onClick={onRemove}
          disabled={removing}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white ml-2 disabled:opacity-60"
          style={{ backgroundColor: "#E44848" }}
        >
          {removing ? "Siliniyor…" : "Avatarı Kaldır"}
        </button>
      )}
    </div>
  );
};
