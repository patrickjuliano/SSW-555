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

const Photos = ({ project, refetch }) => {
	axios.defaults.withCredentials = true;

	const [createPhotoOpen, setCreatePhotoOpen] = useState(false);
	const openCreatePhoto = () => setCreatePhotoOpen(true);
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

	async function onImageUpload(photoId, event) {
		// PAT: Store File object and do this whole chunk (new fileReader, readAsDataURL, onload) inside map for each image
		try {
			let file = event.target.files[0];
			file = checkFile(file);
			const { data } = await axios.patch(`http://localhost:4000/photos/${photoId}/upload?file=${file}`);
			refetch();
		} catch (e) {
			// TODO
			alert(e);
		}
		
		// const fileReader = new FileReader();
		// fileReader.onload = (e) => {
		// 	const image = encodeURIComponent(e.target.result);
		// 	async function fetchData(photoId, image) {
		// 		try {
		// 			const { data } = await axios.patch(`http://localhost:4000/photos/${photoId}/upload?file=${file}`);
		// 			refetch();
		// 		} catch (e) {
		// 			// TODO
		// 			alert(e);
		// 		}
		// 	}
		// 	fetchData(photoId, image);
		// }
		// fileReader.readAsDataURL(event.target.files[0]);
	}

	const getImage = (file) => {
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			const image = e.target.result;
			return image;
		}
		fileReader.readAsDataURL(file);
	}

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', columnGap: 12 }}>
				<h3>Photos</h3>
				<Button variant="contained" onClick={openCreatePhoto}>Create Photo</Button>
			</div>
			<CreatePhoto 
				project={project}
				refetch={refetch}
				open={createPhotoOpen}
				onClose={closeCreatePhoto}
				photo={null}
			/>
			<Confirmation
				title="Delete Photo"
				body="Are you sure you want to delete this photo?"
				open={deletePhotoId}
				onClose={() => setDeletePhotoId(null)}
				onSubmit={deletePhoto}
			/>

			<Grid container spacing={2}>
				{project.photos && project.photos.map((photo, index) => (
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
								<IconButton component="label" aria-label="Insert photo">
									<AddAPhoto />
									{/* <input type="file" accept=".png" hidden onChange={(event) => onImageUpload(photo._id, event)} /> */}
								</IconButton>
								<IconButton aria-label="Photo settings" sx={{ marginLeft: 'auto' }}>
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