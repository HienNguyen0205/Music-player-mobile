const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const player = $('.player')
const audio = $('#audio')
const cdThumb = $('.cd-thumb')
const app = {
    currentIndex: 0,
    songs: [{
            id: 1,
            name: 'Ái nộ',
            singer: 'Masew, Khôi Vũ',
            path: './assets/music/AiNoRemix-MasewKhoiVu-7107607.mp3',
            image: './assets/img/Ái nộ.jpg'
        },
        {
            id: 2,
            name: 'Em là hoàng hôn',
            singer: 'Vang, Cloud5',
            path: './assets/music/EmLaHoangHonDnTeamRemixMaCuaEmTuaHongCanhThamRemix-VangCloud5-7114420.mp3',
            image: './assets/img/Em là hoàng hôn.jpg'
        },
        {
            id: 3,
            name: 'Nevada',
            singer: 'Vicetone, Cozi Zuehlsdorff',
            path: './assets/music/Nevada-Monstercat-6983746.mp3',
            image: './assets/img/Nevada.jpeg'
        },
        {
            id: 4,
            name: 'Once upon the time',
            singer: 'Maxoazo, Moonessa',
            path: './assets/music/OnceUponATime-MaxOazoMoonessa-6021981.mp3',
            image: './assets/img/Once upon the time.jpg'
        },
        {
            id: 5,
            name: 'Savage Love',
            singer: 'Jason Derulo, Jawsh 685',
            path: './assets/music/SavageLove-JasonDerulo-6288663.mp3',
            image: './assets/img/Savage love.jpg'
        }
    ],
    setProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {
        $('.heading-song--name').textContent = this.currentSong.name
        $('.cd-thumb').style.backgroundImage = `url('${this.currentSong.image}')`
        $('#audio').src = this.currentSong.path
    },
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song" data-id="${song.id}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    handleEvents: function () {
        const songNamesInPlaylist = $$('.song')
        playlistEvent()
        // handle rotate CD
        const cdAnimation = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause()
        // handle scroll event
        const cd = $('.cd')
        let cdWidth = cd.offsetWidth
        let isPlaying = false
        document.onscroll = function () {
            let scrolllTop = window.scrollY || document.documentElement.scrollTop
            let newWidth = cdWidth - scrolllTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }
        // handle play/pause event
        playBtn.onclick = function () {
            if (isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // when audio is playing
        audio.onplay = function () {
            player.classList.add('playing')
            isPlaying = true
            cdAnimation.play()
        }
        // when audio is pausing
        audio.onpause = function () {
            if (audio.currentTime != audio.duration) {
                player.classList.remove('playing')
                isPlaying = false
                cdAnimation.pause()
            }
        }
        // handle song process
        const songProgress = $('#progress')
        audio.ontimeupdate = function () {
            if (audio.duration) {
                let timePercent = (audio.currentTime / audio.duration) * 100
                songProgress.value = timePercent
            }
        }
        songProgress.onclick = function (e) {
            const width = this.clientWidth
            const clickX = e.offsetX
            audio.currentTime = (clickX / width) * audio.duration
        }
        // handle backward and forward song
        function checkPlaying() {
            if (isPlaying) {
                audio.play()
            } else {
                audio.pause()
            }
        }

        function nextSong() {
            if (app.currentIndex == app.songs.length - 1) {
                app.currentIndex = 0
            } else {
                app.currentIndex += 1
            }
            app.loadCurrentSong()
            checkPlaying()
            playlistEvent()
        }
        nextBtn.onclick = nextSong
        prevBtn.onclick = function () {
            if (app.currentIndex == 0) {
                app.currentIndex = app.songs.length - 1
            } else {
                app.currentIndex -= 1
            }
            app.loadCurrentSong()
            checkPlaying()
            playlistEvent()
        }
        // handle song in loop
        repeatBtn.onclick = function () {
            if (audio.loop) {
                audio.loop = false
                repeatBtn.style.color = '#666'
            } else {
                audio.loop = true
                repeatBtn.style.color = '#ec1f55'
            }
        }
        // handle random song button
        let isRandom = false
        randomBtn.onclick = function () {
            if (isRandom) {
                randomBtn.style.color = '#666'
                isRandom = false
            } else {
                randomBtn.style.color = '#ec1f55'
                isRandom = true
            }
        }
        // handle when song end
        audio.onended = function () {
            let random = 0
            if (isRandom) {
                do {
                    random = Math.floor(Math.random() * app.songs.length)
                } while (app.currentIndex == random)
                app.currentIndex = random
                app.loadCurrentSong()
                audio.play()
            } else {
                nextSong()
            }
            playlistEvent()
        }
        // handle song in playlist
        function playlistEvent() {
            songNamesInPlaylist.forEach(song => {
                if (song.getAttribute('data-id') == app.songs[app.currentIndex].id) {
                    song.style.backgroundColor = '#00EE00'
                } else {
                    song.style.backgroundColor = '#fff'
                }
            })
        }
        songNamesInPlaylist.forEach(song => {
            song.onclick = function () {
                app.currentIndex = song.getAttribute('data-id') - 1
                app.loadCurrentSong()
                checkPlaying()
                playlistEvent()
            }
        })
    },
    start: function () {
        this.setProperties()
        this.render()
        this.loadCurrentSong()
        this.handleEvents()
    }
}
app.start()