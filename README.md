# Anime API Documentation

Base URL: `https://pixelll.is-a.dev/api`

## Overview

This API provides access to anime information and streaming capabilities. All responses are in JSON format unless otherwise specified.

## Endpoints

### 1. Get Anime List/Search

**GET** `/anime`

Retrieves a paginated list of anime or searches for anime by title.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Search term for anime title (case-insensitive) |
| `page` | integer | No | Page number for pagination |

#### Example Requests

**Get paginated anime list:**
```
GET https://pixelll.is-a.dev/api/anime?page=1
```

**Search for anime:**
```
GET https://pixelll.is-a.dev/api/anime?query=naruto
```

#### Example Response

```json
[
  {
    "cover": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-dE6UHbFFg1A5.jpg",
    "episodes": 220,
    "id": 2313,
    "poster": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-dE6UHbFFg1A5.jpg",
    "rating": 79,
    "slug": "naruto",
    "status": "FINISHED",
    "story": "يعيش Naruto Uzumaki ، النينجا المفرطة النشاط ورأسها ، في Konohagakure ...",
    "title_en": "Naruto",
    "title_jp": "NARUTO -ナルト-",
    "type": "TV"
  },
  {
    "cover": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21220-3cWAUtR1Ih5h.jpg",
    "episodes": 1,
    "id": 504,
    "poster": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21220-3cWAUtR1Ih5h.jpg",
    "rating": 70,
    "slug": "boruto-naruto-the-movie",
    "status": "FINISHED",
    "story": "بوروتو هو ابن ناروتو الذي يرفض والده تمامًا. وراء هذا ...",
    "title_en": "Boruto: Naruto the Movie",
    "title_jp": "BORUTO -NARUTO THE MOVIE-",
    "type": "MOVIE"
  }
]
```

### 2. Get Anime by Slug

**GET** `/anime/{slug}`

Retrieves detailed information about a specific anime.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Unique identifier for the anime |

#### Example Request

```
GET https://pixelll.is-a.dev/api/anime/naruto
```

#### Example Response

```json
 {
    "cover": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-dE6UHbFFg1A5.jpg",
    "episodes": 220,
    "id": 2313,
    "poster": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-dE6UHbFFg1A5.jpg",
    "rating": 79,
    "slug": "naruto",
    "status": "FINISHED",
    "story": "يعيش Naruto Uzumaki ، النينجا المفرطة النشاط ورأسها ، في Konohagakure ...",
    "title_en": "Naruto",
    "title_jp": "NARUTO -ナルト-",
    "type": "TV"
  }
```

#### Error Response

```json
[]
```

### 3. Get Anime Episodes

**GET** `/anime/{slug}/episodes`

Retrieves available episodes and streaming links for a specific anime with arabic subtitle.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Unique identifier for the anime |

#### Example Request

```
GET https://pixelll.is-a.dev/api/anime/naruto/episodes
```

#### Example Response

```json
{
  "2": {
    "720p": {
      "AY": "/api/stream/naruto/2/720p/AY",
      "AB": "/api/stream/naruto/2/720p/AB"
    },
    "1080p": {
      "AY": "/api/stream/naruto/2/1080p/AY",
      "AB": "/api/stream/naruto/2/1080p/AB"
    }
  },
  "3": {
    "720p": {
      "AY": "/api/stream/naruto/3/720p/AY",
      "AB": "/api/stream/naruto/3/720p/AB"
    },
    "1080p": {
      "AY": "/api/stream/naruto/3/1080p/AY",
      "AB": "/api/stream/naruto/3/1080p/AB"
    }
  }
}
```

#### Error Response

```json
[]
```

### 4. Stream Episode

**GET** `/stream/{slug}/{episode}/{quality}/{server}`

Streams a specific episode of an anime.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Unique identifier for the anime |
| `episode` | integer | Yes | Episode number |
| `quality` | string | Yes | Video quality (e.g., "720p", "1080p") |
| `server` | string | Yes | Server identifier ("AY" or "AB") |

#### Server Types

- **AY**: From Animeiat.net 
- **AB**: From Animeblkom.net 
#### Example Request

```
GET https://pixelll.is-a.dev/api/stream/oooku/1/360p/AY
```

## Authentication

No authentication is currently required for any endpoints.

## Notes

- All anime titles support Arabic
- Quality options depend on what's available for each episode
- Server availability may vary per episode and quality
