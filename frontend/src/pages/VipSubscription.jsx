import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Check, Star, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import subscriptionService from "../services/subscriptionService";
import api from "../services/api";
import CONFIG from "../config";
const VipSubscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [user, setUser] = useState(null);
  const [vipStatus, setVipStatus] = useState({
    isVip: false,
    endDate: null,
  });
  // Track loading state for each package separately
  const [loadingPackages, setLoadingPackages] = useState({
    monthly: false,
    yearly: false,
  });

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login", { state: { from: "/vip-subscription" } });
      return;
    }
    setUser(currentUser);

    // Check VIP status
    const checkVipStatus = async () => {
      try {
        const response = await subscriptionService.getVipStatus(currentUser.id);
        setVipStatus({
          isVip: response.vipStatus || false,
          endDate: response.vipEndDate || null,
        });
      } catch (err) {
        console.error("Error checking VIP status:", err);
      }
    };

    checkVipStatus();
  }, [navigate]);

  const subscriptionPackages = [
    {
      id: "monthly",
      title: "Monthly VIP",
      price: "$1.25",
      period: "month",
      features: [
        "Ad-free reading experience",
        "Access to all premium manga",
        "Early access to new chapters",
        "High-quality images",
        "Download chapters for offline reading",
      ],
      image: `${CONFIG.BACKEND_URL}/vip/monthly_vip.jpeg`,
      paypalPackageType: "MONTHLY",
    },
    {
      id: "yearly",
      title: "Yearly VIP",
      price: "$12.5",
      period: "year",
      features: [
        "All Monthly VIP benefits",
        "Save 17% compared to monthly plan",
        "Exclusive seasonal content",
        "Priority customer support",
        "Participate in beta features",
      ],
      image: `${CONFIG.BACKEND_URL}/api/vip/yearly_vip.jpeg",
      paypalPackageType: "ANNUAL",
      recommended: true,
    },
  ];

  const handleSubscribe = async (packageType) => {
    if (!user) {
      navigate("/login", { state: { from: "/vip-subscription" } });
      return;
    }

    // Set the selected package and prevent multiple clicks
    setSelectedPackage(packageType.id);
    // Set loading state for this specific package
    setLoadingPackages((prev) => ({
      ...prev,
      [packageType.id]: true,
    }));
    setError(null);

    try {
      // Create PayPal order using the subscription service
      const response = await subscriptionService.createOrder(
        user.id,
        packageType.paypalPackageType
      );

      // Find the approval URL in the response
      const links = response.links || [];
      const approvalUrl = links.find((link) => link.rel === "approve")?.href;

      // Redirect to PayPal checkout
      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        setError("Failed to create subscription. Please try again.");
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create subscription. Please try again."
      );
    } finally {
      // Reset loading state for this specific package
      setLoadingPackages((prev) => ({
        ...prev,
        [packageType.id]: false,
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  // Check if URL contains success parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("status");

    if (paymentStatus === "success") {
      setSuccess(true);
      // Remove query parameters from URL
      window.history.replaceState({}, document.title, "/vip-subscription");
      // Refresh VIP status
      if (user) {
        const checkVipStatus = async () => {
          try {
            const response = await subscriptionService.getVipStatus(user.id);
            setVipStatus({
              isVip: response.vipStatus || false,
              endDate: response.vipEndDate || null,
            });
          } catch (err) {
            console.error("Error checking VIP status:", err);
          }
        };
        checkVipStatus();
      }
    } else if (paymentStatus === "cancel") {
      setError("Payment was cancelled.");
      // Remove query parameters from URL
      window.history.replaceState({}, document.title, "/vip-subscription");
    } else if (paymentStatus === "error") {
      const errorMessage = urlParams.get("message") || "Payment processing failed";
      setError(decodeURIComponent(errorMessage.replace(/\+/g, ' ')));
      // Remove query parameters from URL
      window.history.replaceState({}, document.title, "/vip-subscription");
    }
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        VIP Subscription
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Upgrade your manga experience with our VIP subscription plans
      </Typography>

      {vipStatus.isVip && (
        <Alert severity="info" sx={{ mb: 4 }}>
          You are currently a VIP member! Your subscription is valid until{" "}
          {new Date(vipStatus.endDate).toLocaleDateString()}.
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {subscriptionPackages.map((pkg) => (
          <Grid item xs={12} md={6} key={pkg.id}>
            <Card
              elevation={pkg.recommended ? 8 : 3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
                border: pkg.recommended ? "2px solid #ff6740" : "none",
              }}
            >
              {pkg.recommended && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "#ff6740",
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                >
                  BEST VALUE
                </Box>
              )}
              <CardMedia
                component="img"
                height="200"
                image={pkg.image}
                alt={pkg.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {pkg.title}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {pkg.price}
                  <Typography
                    variant="subtitle1"
                    component="span"
                    color="text.secondary"
                  >
                    /{pkg.period}
                  </Typography>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {pkg.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Check color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => handleSubscribe(pkg)}
                  disabled={loadingPackages.monthly || loadingPackages.yearly}
                  endIcon={
                    loadingPackages[pkg.id] ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ArrowForward />
                    )
                  }
                  sx={{
                    py: 1.5,
                    bgcolor: pkg.recommended ? "#ff6740" : "primary.main",
                    "&:hover": {
                      bgcolor: pkg.recommended ? "#e55a35" : "primary.dark",
                    },
                  }}
                >
                  {vipStatus.isVip ? "Extend Subscription" : "Subscribe Now"}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          <Star sx={{ mr: 1, verticalAlign: "middle", color: "#FFD700" }} />
          VIP Benefits
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ad-Free Experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enjoy your favorite manga without any interruptions from
                advertisements.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Premium Content Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get exclusive access to premium manga titles and early chapter
                releases.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                High-Quality Images
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read all manga in the highest resolution available for the best
                experience.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
          variant="filled"
        >
          <Typography variant="body2">
            {error || "Failed to create subscription. Please try again."}
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your subscription was successful! You are now a VIP member.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VipSubscription;