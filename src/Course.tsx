import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Grid, Card, CardActionArea, CardContent, CardMedia,
  Typography, Rating, CircularProgress, Box, TextField, Select, MenuItem,
   InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { SelectChangeEvent } from '@mui/material'; 

interface Course {
  title: string;
  instructors: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

const Course: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:3000/api/courses');
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchValue) ||
      course.instructors.some(instructor => instructor.toLowerCase().includes(searchValue))
    );
    setFilteredCourses(filtered);
  };

  const handleSort = (event: SelectChangeEvent<string>) => {
    const sortValue = event.target.value;
    setSortBy(sortValue);
    const sortedCourses = [...filteredCourses].sort((a, b) => {
      if (sortValue === 'rating') {
        return b.rating - a.rating;
      } else if (sortValue === 'reviewCount') {
        return b.reviewCount - a.reviewCount;
      } else {
        return 0;
      }
    });
    setFilteredCourses(sortedCourses);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress /> Loading
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 6, marginBottom: 4 }}>
        <Typography variant="h3" component="h1" sx={{ marginBottom: 3, fontWeight: 'bold', textAlign: 'center' }}>
           Courses
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 4,
            gap: 2,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              label="Search for Courses"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
        
          <Box>
            <Select
              value={sortBy}
              onChange={handleSort}
              displayEmpty
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
              IconComponent={() => <SortIcon />}
            >
              <MenuItem value="">Sort by</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="reviewCount">Review Count</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {filteredCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 3,
                boxShadow: 4,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 8,
                },
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.imageUrl}
                  alt={course.title}
                  sx={{ objectFit: 'cover', borderBottom: '1px solid #ddd' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 1,
                    }}
                  >
                    {course.instructors.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      name={`course-rating-${index}`}
                      value={course.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2">
                      {course.rating} ({course.reviewCount} reviews)
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Course;
