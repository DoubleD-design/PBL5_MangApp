import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import adService from "../services/adService";
import { useUser } from "../context/UserContext";
import { useRef } from "react";

const AdPopup = ({ onClose, triggerType = "chapter_view" }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchAd = async () => {
      try {
        setLoading(true);
        // Check if user is VIP
        const isVIP = await adService.isUserVIP();

        // Don't show ads to VIP users
        if (isVIP) {
          onClose();
          return;
        }

        // Fetch ad content
        const adData = await adService.getAds();
        console.log("Fetch ad:", adData);
        if (adData && adData.length > 0) {
          setAd(adData[0]); // Chỉ lấy quảng cáo đầu tiên
          adService.trackImpression(adData[0].id);
        }
      } catch (error) {
        console.error("Error loading advertisement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [onClose]);

  const handleAdClick = () => {
    if (ad) {
      // Track click
      adService.trackClick(ad.id);

      // Open ad link in new tab if available
      if (ad.link) {
        window.open(ad.link, "_blank");
      }
    }
  };
  //navigate("/vip-subscription");
  const handleSubscribe = () => {
    // Navigate to VIP subscription page
    //navigate("/vip-subscription");
    window.open("/vip-subscription", "_blank");
  };

  // If loading or no ad available, don't render anything
  if (loading || !ad) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          width: "60%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>

        {/* Ad content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Ad title */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {ad.title || "Special Offer"}
          </Typography>

          {/* Ad image */}
          <Box
            component="img"
            src={
              `https://mangavn-c8fwghesfqgre2gn.eastasia-01.azurewebsites.net${ad.imageUrl}` ||
              "https://mangavn-c8fwghesfqgre2gn.eastasia-01.azurewebsites.net/ads/Vietnam_Travel_Ad_Facebook_Post.jpg"
            }
            alt={ad.title || "Advertisement"}
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              maxHeight: "250px",
              borderRadius: 1,
              cursor: "pointer",
              mb: 2,
            }}
            onClick={handleAdClick}
          />

          {/* Ad description */}
          {ad.description && (
            <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
              {ad.description}
            </Typography>
          )}

          {/* Call to action button */}
          {ad.callToAction && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubscribe}
              sx={{ mb: 2 }}
            >
              {ad.callToAction}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdPopup;
