import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardActionArea, CardContent, CardMedia, Typography, Rating, CircularProgress, Box } from '@mui/material';


interface Course {
  title: string;
  instructors: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

const Course: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:3000/api/courses'); 
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress /> Loading
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ marginTop: 10 }}>
        {courses.map((course, index) => (
          <Grid item xs={12} md={6} lg={2.4} key={index}>
            <CardActionArea>
              <Card
                sx={{
                  width: '100%',
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={course.imageUrl}
                  alt={course.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {course.instructors.join(', ')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}
                  >
                    {course.rating}
                    <Rating
                      name={`course-rating-${index}`}
                      value={course.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ marginLeft: 1 }}
                    />
                    ({course.reviewCount})
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Course;
