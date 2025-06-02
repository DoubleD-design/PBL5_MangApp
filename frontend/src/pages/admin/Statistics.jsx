import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import statisticsService from "../../services/statisticsService";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [topManga, setTopManga] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getDashboardSummary();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch revenue data and top manga
  useEffect(() => {
    const fetchRevenueAndTopManga = async () => {
      try {
        setLoading(true);

        // Format dates for API if they exist
        const formattedStartDate = dateRange.startDate
          ? dateRange.startDate
          : null;
        const formattedEndDate = dateRange.endDate ? dateRange.endDate : null;

        // Fetch revenue data
        const revenueResponse = await statisticsService.getRevenueData(
          formattedStartDate,
          formattedEndDate
        );
        setRevenueData(revenueResponse);

        // Fetch top manga data
        const topMangaResponse = await statisticsService.getTopManga(
          formattedStartDate,
          formattedEndDate,
          5 // Limit to top 5
        );
        setTopManga(topMangaResponse.items || []);

        setError(null);
      } catch (err) {
        console.error("Error fetching statistics data:", err);
        setError("Failed to load statistics data");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueAndTopManga();
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyDateFilter = () => {
    // The useEffect will handle the data fetching when dateRange changes
  };

  // Prepare chart data
  const chartData = revenueData
    ? {
        labels: revenueData.labels,
        datasets: [
          {
            label: "Revenue",
            data: revenueData.revenueData,
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            tension: 0.4,
          },
          {
            label: "New VIP Subscriptions",
            data: revenueData.subscriptionData,
            borderColor: theme.palette.secondary.main,
            backgroundColor: theme.palette.secondary.light,
            tension: 0.4,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue & Subscriptions Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading && !dashboardData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !dashboardData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Date Range Filter */}
      <Paper
        sx={{ p: 2, mb: 3, display: "flex", alignItems: "center", gap: 2 }}
      >
        <Typography variant="subtitle1">Date Range:</Typography>
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          value={dateRange.startDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          name="endDate"
          label="End Date"
          type="date"
          value={dateRange.endDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button
          variant="contained"
          onClick={applyDateFilter}
          startIcon={<TrendingUpIcon />}
        >
          Apply
        </Button>
      </Paper>

      {/* Dashboard Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* VIP Users Card */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <GroupIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6">VIP Users</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {dashboardData?.vipUserCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total VIP subscribers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Page Views Card */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <VisibilityIcon
                  sx={{ color: theme.palette.info.main, mr: 1 }}
                />
                <Typography variant="h6">Today's Page Views</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {dashboardData?.todayPageViews || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Views in the last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Card */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                ${dashboardData?.totalRevenue?.toFixed(2) || "0.00"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lifetime revenue from subscriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Revenue & Subscriptions Trend
            </Typography>
            {loading && !revenueData ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : chartData ? (
              <Box sx={{ height: 350 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            ) : (
              <Typography color="text.secondary">No data available</Typography>
            )}
          </Paper>
        </Grid>

        {/* Top Manga List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Top Manga
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading && topManga.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : topManga.length > 0 ? (
              <List>
                {topManga.map((manga, index) => (
                  <ListItem
                    key={manga.id}
                    divider={index < topManga.length - 1}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={manga.coverImage}
                        alt={manga.title}
                        variant="rounded"
                        sx={{ width: 50, height: 70, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={manga.title}
                      secondary={`${manga.viewCount} views`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No manga data available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
