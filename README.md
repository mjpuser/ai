# ai
General AI project

# Vision
## Retina Cells
The human retina contains about 120 million rod cells and 6 million cone cells. The number and ratio of rods to cones varies among species, dependent on whether an animal is primarily diurnal or nocturnal. Certain owls, such as the tawny owl,[6] have a tremendous number of rods in their retinae. In addition, there are about 2.4 million to 3 million ganglion cells in the human visual system, the axons of these cells form the 2 optic nerves, 1 to 2% of them photosensitive.  This means there are about 100 rods & cones per ganglion.

In the primate eye, the information gathered by 125 million receptor cells converges on 10 million bipolar cells, which, in turn, converge on 1 million retinal ganglion cells


### Rods and Cones
The retina is the outermost layer of neurons that accept input.  3 types of cones (R, B, G) and rods.  Rods are more sensitive to light than cones (by 100 fold) but have a lower resolution since there is convergence to bipolar cells (there are many rods to one bipolar cell -- 1: ?).  To cut down on memory usage, and computation needs, we are going to remove the rods entirely, and only rely on cones.  Cones have a 100 to 10 to 1 relationship with ganglion cells:  cones -> bipolar cells -> ganglion cells.  There is also a high density cones in the center of the retina vs the periphery.  This is for focus on a single than rather than everything. Rods are more densely populated on the periphery, though, however they have less resolution as stated above.  Photo receptors are inhibited when they sense light, and are depolarized in the dark.

### Bipolar Cells and Horizontal Cells
Bipolar cells relay cone and rod stimuli, and offer a graded potential to ganglion cells.  

### Ganglion Cells
Ganglion cells have on-center and off-center receptive fields.  When a light reaches an on-center ganglion cell, it will inhibit the rods and cones in the surround area.  In an off-center ganglion cell, it will inhibit the photoreceptors in the surrounding area when there is darkness in the middle.  Ganglion cells then relay to the thalamus.

There are two types of ganglion cells, transient and sustained.  Transient ganglion cells will fire rapidly on first excitement, and go back to resting.  Sustained have a smaller initial jump, and stronger idle firing rate.  This might be the clue to Moving vs Non-moving objects.

#Fovea
Although there are more than 130 million retinal receptors, there are only approximately 1.2 million fibres (axons) in the optic nerve; a large amount of pre-processing is performed within the retina. The fovea produces the most accurate information. Despite occupying about 0.01% of the visual field (less than 2° of visual angle), about 10% of axons in the optic nerve are devoted to the fovea. The resolution limit of the fovea has been determined at around 10,000 points.[clarification needed] See visual acuity. The information capacity is estimated at 500,000 bits per second (for more information on bits, see information theory) without colour or around 600,000 bits per second including colour.[citation needed] [https://en.wikipedia.org/wiki/Retina]


# ffmpeg

```ffmpeg -video_size 69x69 -framerate 10 -f x11grab -i :0.0 -c:v rawvideo -pix_fmt:v rgb24 -f rawvideo -```
