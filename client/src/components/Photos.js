import AddAPhoto from '@mui/icons-material/AddAPhoto';
import Delete from '@mui/icons-material/Delete';
import Settings from '@mui/icons-material/Settings';

import { Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import '../App.css';
import { checkFile, checkString } from '../validation';
import Confirmation from './Confirmation';

import CreatePhoto from './CreatePhoto';
import UploadPhoto from './UploadPhoto';

const Photos = ({ project, refetch }) => {
	axios.defaults.withCredentials = true;

	const [photo, setPhoto] = useState(null);

	const [uploadPhotoOpen, setUploadPhotoOpen] = useState(false);
	const openUploadPhoto = (photo) => {
		setPhoto(photo);
		setUploadPhotoOpen(true);
	}
	const closeUploadPhoto = () => setUploadPhotoOpen(false);

	const [createPhotoOpen, setCreatePhotoOpen] = useState(false);
	const openCreatePhoto = () => {
		setPhoto(null);
		setCreatePhotoOpen(true);
	}
	const openEditPhoto = (photo) => {
		setPhoto(photo);
		setCreatePhotoOpen(true);
	}
	const closeCreatePhoto = () => setCreatePhotoOpen(false);

	const [deletePhotoId, setDeletePhotoId] = useState(null);
	async function deletePhoto() {
		try {
			const { data } = await axios.delete(`http://localhost:4000/photos/${deletePhotoId}`);
			refetch();
			setDeletePhotoId(null);
		} catch (e) {
			// TODO
			alert(e);
		}
	}

	const reorderPhotos = (photos) => {
		const requiredPhotos = photos.filter(photo => photo.required);
		const optionalPhotos = photos.filter(photo => !photo.required);
		return requiredPhotos.concat(optionalPhotos);
	}

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', columnGap: 12 }}>
				<h3>Photos</h3>
				<Button variant="contained" onClick={openCreatePhoto}>Create Photo</Button>
			</div>
			<UploadPhoto
				project={project}
				refetch={refetch}
				open={uploadPhotoOpen}
				onClose={closeUploadPhoto}
				photo={photo}
			/>
			<CreatePhoto 
				project={project}
				refetch={refetch}
				open={createPhotoOpen}
				onClose={closeCreatePhoto}
				photo={photo}
			/>
			<Confirmation
				title="Delete Photo"
				body="Are you sure you want to delete this photo?"
				open={deletePhotoId}
				onClose={() => setDeletePhotoId(null)}
				onSubmit={deletePhoto}
			/>

			<Grid container spacing={2}>
				{project.photos && reorderPhotos(project.photos).map((photo, index) => (
					<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
						<Card variant="outlined">
							<CardMedia
								component="img"
								image={photo.src ? photo.src : "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"}
							/>
							<CardContent>
								<Typography variant="h6" component="div">{photo.title}</Typography>
								<Typography variant="subtitle2" color="text.secondary">{photo.required ? 'REQUIRED' : 'OPTIONAL'}</Typography>
								<input
									id={`image${index}`}
									type="file"
									accept=".png"
									hidden
								/>
							</CardContent>
							<CardActions disableSpacing>
								<IconButton aria-label="Upload photo" onClick={() => openUploadPhoto(photo)}>
									<AddAPhoto />
								</IconButton>
								<IconButton aria-label="Edit photo" onClick={() => openEditPhoto(photo)} sx={{ marginLeft: 'auto' }}>
									<Settings />
								</IconButton>
								<IconButton aria-label="Delete photo" onClick={() => setDeletePhotoId(photo._id)}>
									<Delete />
								</IconButton>
							</CardActions>
						</Card>
					</Grid>
				))}
			</Grid>
			
		</div>
	);
};

export default Photos;