import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Box,
  Checkbox,
  Grid,
  MenuItem,
  Radio,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../../common/Header';
import Footer from '../Home/components/Footer';
import { lecturerCompleteProfile } from './redux/lecturerCompleteProfileActions';
import { storage } from '../../config/firebase.config';

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(
          // eslint-disable-next-line react/destructuring-assignment
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const departments = [
  {
    department: '',
    topics: [],
  },
  {
    department: 'Computer Science',
    topics: ['HTML', 'MongoDB', 'Django', 'NoSQL', 'ASP.NET'],
  },
  {
    department: 'Management',
    topics: [
      'Leadership',
      'Motivation & Job Satisfaction',
      'Emotional Intelligence',
      'Communication',
      'Groups & Teams',
      'Recruiting',
      'Compensation',
      'Training',
      'Cross-cultural management',
      'Mission, vision, & goal-setting',
      'designing & formulating strategy',
      'Strategy implementation',
      'Corporate culture',
      'Organizational structure',
      'Innovation',
    ],
  },
];

const useStyles = makeStyles(() => ({
  btn: {
    background: '#00b074',
    borderRadius: 5,
    padding: '13px 0px',
    width: '200px',
    textAlign: 'center',
    cursor: 'pointer',
    color: 'white',
    transition: 'background-color 0.5s ease',
    '&:hover': {
      background: '#019563',
    },
  },
  formTitle: {
    fontSize: 20,
  },
}));

function HomePage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.signInReducer.user);

  const [uploadPercentage, setUploadPercentage] = React.useState(0);
  const [imageUploading, setImageUploading] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      history.push('/');
    } else if (user.type !== 'lecturer') {
      history.push('/');
    }
  }, [user]);

  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [aboutMe, setAboutMe] = React.useState('');
  const [type, setType] = React.useState('Guest Lecturer');

  const [zoom, setZoom] = React.useState(true);
  const [inPerson, setInPerson] = React.useState(true);

  const [education1, setEducation1] = React.useState({
    level: 'Level',
    focus: '',
    school: '',
  });

  const [education2, setEducation2] = React.useState({
    level: 'Level',
    focus: '',
    school: '',
  });

  const [selectedDepartment1, setSelectedDepartment1] = React.useState('');
  const [selectedTopics1, setSelectedTopics1] = React.useState([]);

  const [selectedDepartment2, setSelectedDepartment2] = React.useState('');
  const [selectedTopics2, setSelectedTopics2] = React.useState([]);

  const [gitHub, setGitHub] = React.useState('');
  const [linkedIn, setLinkedIn] = React.useState('');
  const [personalPortfolio, setPersonalPortfolio] = React.useState('');
  const [blog, setBlog] = React.useState('');
  const [twitter, setTwitter] = React.useState('');

  const [profilePic, setProfilePic] = React.useState('');
  const [profilePicURL, setProfilePicURL] = React.useState('');

  const classes = useStyles();

  const submit = () => {
    const req = {
      city,
      state,
      type,
      aboutMe,
      zoom,
      inPerson,
      education: [],
      recruitingDepartment: [],
      socialMedia: {},
      img: profilePicURL,
    };

    if (gitHub) {
      req.socialMedia.GitHub = gitHub;
    }
    if (linkedIn) {
      req.socialMedia.LinkedIn = linkedIn;
    }
    if (personalPortfolio) {
      req.socialMedia.PersonalPortfolio = personalPortfolio;
    }
    if (blog) {
      req.socialMedia.Blog = blog;
    }
    if (twitter) {
      req.socialMedia.Twitter = twitter;
    }

    if (education1.level !== 'Level') {
      req.education.push(education1);
    }

    if (education2.level !== 'Level') {
      req.education.push(education2);
    }

    if (selectedDepartment1) {
      const reqSelectedDepartment1 = {
        department: selectedDepartment1,
        topics: selectedTopics1,
      };
      req.recruitingDepartment.push(reqSelectedDepartment1);
    }

    if (selectedDepartment2) {
      const reqSelectedDepartment2 = {
        department: selectedDepartment2,
        topics: selectedTopics2,
      };
      req.recruitingDepartment.push(reqSelectedDepartment2);
    }
    console.log(req);
    dispatch(lecturerCompleteProfile(req));
  };

  const previewImage = async (event) => {
    setImageUploading(true);
    setProfilePic(URL.createObjectURL(event.target.files[0]));
    const storageRef = ref(
      storage,
      `${user._id}/${event.target.files[0].name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, event.target.files[0]);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(progress);
        console.log(`Upload is ${progress}% done`);
        // eslint-disable-next-line default-case
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploading(false);
          console.log(downloadURL);
          setProfilePicURL(downloadURL);
        });
      }
    );

    /* uploadBytes(storageRef, event.target.files[0]).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log(downloadURL);
        setProfilePicURL(downloadURL);
      });
    }); */
  };

  return (
    <div>
      <Header />
      <div style={{ margin: '30px 20%' }}>
        <div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              marginBottom: 50,
              textAlign: 'center',
            }}
          >
            Complete Your Profile
          </div>

          {/* University or School Information */}
          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>User Type</span>
            </Grid>
            <Grid item xs={4}>
              <Radio
                checked={type === 'Guest Lecturer'}
                onChange={(e) => setType(e.target.value)}
                value="Guest Lecturer"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'A' }}
              />
              Guest Lecturer
            </Grid>
            <Grid item xs={4}>
              <Radio
                checked={type === 'Adjunct Professor'}
                onChange={(e) => setType(e.target.value)}
                value="Adjunct Professor"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'A' }}
              />
              Adjunct Professor
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>Lecture Type</span>
            </Grid>
            <Grid item xs={4}>
              <Checkbox
                checked={inPerson}
                onChange={(e) => setInPerson(e.target.checked)}
                value="Guest Lecturer"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'A' }}
              />
              In-Person
            </Grid>
            <Grid item xs={4}>
              <Checkbox
                checked={zoom}
                onChange={(e) => setZoom(e.target.checked)}
                value="Adjunct Professor"
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'A' }}
              />
              Zoom
            </Grid>
          </Grid>

          {/* University or School Information */}
          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>Where do you live?</span>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={city}
                onChange={(e) => setCity(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="City"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={state}
                onChange={(e) => setState(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="State"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>About Yourself</span>
            </Grid>
            <Grid item xs={8}>
              <TextField
                multiline
                value={aboutMe}
                rows={3}
                onChange={(e) => setAboutMe(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Tell us about yourself"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>Prior Education</span>
            </Grid>
            <Grid item xs={4}>
              <Select
                value={education1.level}
                onChange={(e) =>
                  setEducation1({ ...education1, level: e.target.value })
                }
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                type="text"
                variant="outlined"
              >
                <MenuItem value="Level">Level</MenuItem>
                <MenuItem value="Graduate Degree">Graduate Degree</MenuItem>
                <MenuItem value="Undergraduate Degree">
                  Undergraduate Degree
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={education1.focus}
                onChange={(e) =>
                  setEducation1({ ...education1, focus: e.target.value })
                }
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Focus"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={education1.school}
                onChange={(e) =>
                  setEducation1({ ...education1, school: e.target.value })
                }
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="School"
              />
            </Grid>

            <Grid item xs={4}>
              <Select
                value={education2.level}
                onChange={(e) =>
                  setEducation2({ ...education2, level: e.target.value })
                }
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="small"
                type="text"
                variant="outlined"
                placeholder="City"
              >
                <MenuItem value="Level">Level</MenuItem>
                <MenuItem value="Graduate Degree">Graduate Degree</MenuItem>
                <MenuItem value="Undergraduate Degree">
                  Undergraduate Degree
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={education2.focus}
                onChange={(e) =>
                  setEducation2({ ...education2, focus: e.target.value })
                }
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Focus"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={education2.school}
                onChange={(e) =>
                  setEducation2({ ...education2, school: e.target.value })
                }
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white' }}
                fullWidth
                size="medium"
                type="text"
                variant="outlined"
                placeholder="School"
              />
            </Grid>
          </Grid>

          {/* For which Functional department are you recruiting */}
          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>
                In which areas do you want to provide guest lecture(s)?
              </span>
            </Grid>
            <Grid item xs={5}>
              Department
              <Select
                value={selectedDepartment1}
                onChange={(e) => {
                  setSelectedDepartment1(e.target.value);
                  setSelectedTopics1([]);
                }}
                variant="outlined"
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
                style={{ width: 200, marginLeft: 30 }}
              >
                {departments
                  .filter((el) => el.department !== selectedDepartment2)
                  .map((department, index) => (
                    <MenuItem
                      // disabled={selectedTopics1.indexOf(topic) <= -1}
                      value={department.department}
                      key={index}
                      style={{ height: 40 }}
                    >
                      <span>{department.department}</span>
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={7} style={{ textAlign: 'right' }}>
              Topics
              <Select
                variant="outlined"
                multiple
                disabled={selectedDepartment1 === ''}
                value={selectedTopics1}
                renderValue={(selected) => selected.join(', ')}
                onChange={(e) => {
                  setSelectedTopics1(e.target.value);
                }}
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
                style={{ width: 400, marginLeft: 30 }}
              >
                {departments
                  .filter((el) => el.department === selectedDepartment1)[0]
                  .topics.map((topic, index) => (
                    <MenuItem
                      // disabled={selectedTopics1.indexOf(topic) <= -1}
                      value={topic}
                      key={index}
                    >
                      <Checkbox checked={selectedTopics1.indexOf(topic) > -1} />
                      <span>{topic}</span>
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            {/* fdsfdsfdsfdsfsdff */}
            <Grid item xs={5}>
              Department
              <Select
                value={selectedDepartment2}
                onChange={(e) => {
                  setSelectedDepartment2(e.target.value);
                  setSelectedTopics2([]);
                }}
                variant="outlined"
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
                style={{ width: 200, marginLeft: 30 }}
              >
                {departments
                  .filter((el) => el.department !== selectedDepartment1)
                  .map((department, index) => (
                    <MenuItem
                      // disabled={selectedTopics1.indexOf(topic) <= -1}
                      value={department.department}
                      key={index}
                      style={{ height: 40 }}
                    >
                      <span>{department.department}</span>
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={7} style={{ textAlign: 'right' }}>
              Topics
              <Select
                variant="outlined"
                multiple
                disabled={selectedDepartment2 === ''}
                value={selectedTopics2}
                renderValue={(selected) => selected.join(', ')}
                onChange={(e) => {
                  setSelectedTopics2(e.target.value);
                }}
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
                style={{ width: 400, marginLeft: 30 }}
              >
                {departments
                  .filter((el) => el.department === selectedDepartment2)[0]
                  .topics.map((topic, index) => (
                    <MenuItem
                      // disabled={selectedTopics1.indexOf(topic) <= -1}
                      value={topic}
                      key={index}
                    >
                      <Checkbox checked={selectedTopics2.indexOf(topic) > -1} />
                      <span>{topic}</span>
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>Link Social Media</span>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
              }}
            >
              <div style={{ width: 100 }}>GitHub</div>
              <TextField
                value={gitHub}
                onChange={(e) => setGitHub(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white', width: 500, marginLeft: 40 }}
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Insert Link"
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 100 }}> LinkedIn</div>
              <TextField
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white', width: 500, marginLeft: 40 }}
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Insert Link"
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 100 }}>Personal Portfolio</div>
              <TextField
                value={personalPortfolio}
                onChange={(e) => setPersonalPortfolio(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white', width: 500, marginLeft: 40 }}
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Insert Link"
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 100 }}>Blog</div>
              <TextField
                value={blog}
                onChange={(e) => setBlog(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white', width: 500, marginLeft: 40 }}
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Insert Link"
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 100 }}>Twitter</div>
              <TextField
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                inputProps={{
                  style: { WebkitBoxShadow: '0 0 0 1000px white inset' },
                }}
                style={{ background: 'white', width: 500, marginLeft: 40 }}
                size="medium"
                type="text"
                variant="outlined"
                placeholder="Insert Link"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <span className={classes.formTitle}>Profile Picture</span>
            </Grid>
            {imageUploading ? (
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 40,
                }}
              >
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 5 }}>
                    <CircularProgressWithLabel value={uploadPercentage} />
                  </div>
                  <div>Image Uploading ...</div>
                </div>
              </Grid>
            ) : (
              <>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="icon-button-file"
                      type="file"
                      multiple
                      onChange={previewImage}
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="icon-button-file">
                      <Avatar
                        alt="A"
                        src={profilePic}
                        style={{ height: 150, width: 150 }}
                      />
                      <AddCircleIcon
                        style={{
                          color: 'black',
                          cursor: 'pointer',
                          fontSize: 50,
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                        }}
                      />
                    </label>
                  </div>
                </Grid>
              </>
            )}
          </Grid>
        </div>
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div className={classes.btn} onClick={submit}>
            Save
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
