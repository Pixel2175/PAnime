#!/usr/bin/env python3

import curses
import requests
import json
import subprocess
import sys
import textwrap
from typing import List, Dict, Any, Optional
import urllib.parse

BASE_URL = "https://pixelll.is-a.dev/api"
ANIME_LIST_URL = f"{BASE_URL}/anime"
ANIME_DETAIL_URL = f"{BASE_URL}/anime"
STREAM_URL = f"{BASE_URL}/stream"

class AnimeApp:
    def __init__(self):
        self.current_page = 1
        self.anime_list = []
        self.selected_index = 0
        self.current_anime = None
        self.episodes = {}
        self.screen_stack = []
        self.current_screen = "list"
        self.search_query = ""
        self.episode_selected = 0
        self.quality_selected = 0
        self.server_selected = 0
        
    def fetch_anime_list(self, page: int = 1, query: str = "") -> List[Dict]:
        try:
            params = {"page": page}
            if query:
                params["query"] = query
            
            response = requests.get(ANIME_LIST_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                return data
            return []
        except Exception as e:
            return []
    
    def fetch_anime_detail(self, slug: str) -> Optional[Dict]:
        try:
            url = f"{ANIME_DETAIL_URL}/{slug}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, dict):
                return data
            return None
        except Exception as e:
            return None
    
    def fetch_episodes(self, slug: str) -> Dict:
        try:
            url = f"{ANIME_DETAIL_URL}/{slug}/episodes"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, dict):
                return data
            return {}
        except Exception as e:
            return {}
    
    def open_stream(self, stream_path: str):
        try:
            base_domain = "https://pixelll.is-a.dev"
            full_url = f"{base_domain}{stream_path}"
            
            players = ["mpv", "vlc", "totem", "xdg-open"]
            
            for player in players:
                try:
                    subprocess.run([player, full_url], check=True)
                    break
                except (subprocess.CalledProcessError, FileNotFoundError):
                    continue
            else:
                print(f"\nNo video player found. Stream URL: {full_url}")
                input("Press Enter to continue...")
                
        except Exception as e:
            pass
    
    def wrap_text(self, text: str, width: int) -> List[str]:
        if not text:
            return [""]
        return textwrap.wrap(text, width=width-4, break_long_words=True)
    
    def draw_header(self, stdscr, title: str):
        height, width = stdscr.getmaxyx()
        
        stdscr.addstr(0, 0, " " * (width-1), curses.A_REVERSE)
        
        header_text = f" {title}"
        if len(header_text) < width:
            stdscr.addstr(0, 0, header_text, curses.A_REVERSE | curses.A_BOLD)
        
        nav_info = " Q:Quit | ↑↓:Navigate | Enter:Select"
        if self.current_screen == "list":
            nav_info += " | N:Next | B:Back | S:Search"
        elif self.current_screen == "detail":
            nav_info += " | B:Back | E:Episodes"
        elif self.current_screen == "episodes":
            nav_info += " | B:Back"
        elif self.current_screen == "search":
            nav_info += " | Esc:Cancel"
        
        if len(nav_info) < width:
            stdscr.addstr(1, 0, nav_info[:width-1], curses.A_DIM)
        
        stdscr.addstr(2, 0, "─" * (width-1))
    
    def draw_anime_list(self, stdscr):
        height, width = stdscr.getmaxyx()
        
        title = f"Anime Browser - Page {self.current_page}"
        if self.search_query:
            title += f" - Search: '{self.search_query}'"
        
        self.draw_header(stdscr, title)
        
        start_row = 3
        visible_height = height - start_row - 2
        
        if not self.anime_list:
            stdscr.addstr(start_row + 2, 2, "No anime found. Press 'N' to load or 'S' to search.")
            return
        
        scroll_offset = max(0, self.selected_index - visible_height // 2)
        
        for i, anime in enumerate(self.anime_list[scroll_offset:scroll_offset + visible_height]):
            actual_index = i + scroll_offset
            row = start_row + i
            
            if row >= height - 2:
                break
            
            attr = curses.A_REVERSE if actual_index == self.selected_index else curses.A_NORMAL
            
            title_en = anime.get('title_en', 'Unknown Title')[:width-20]
            episodes = anime.get('episodes', 0)
            rating = anime.get('rating', 0)
            status = anime.get('status', 'Unknown')[:10]
            
            line = f"{actual_index + 1:3d}. {title_en:<{width-30}} | EP:{episodes:3d} | ★{int(rating):2d} | {status}"
            line = line[:width-2]
            
            stdscr.addstr(row, 1, line, attr)
        
        status = f"Items: {len(self.anime_list)} | Selected: {self.selected_index + 1}"
        stdscr.addstr(height - 1, 1, status, curses.A_DIM)
    
    def draw_anime_detail(self, stdscr):
        height, width = stdscr.getmaxyx()
        
        if not self.current_anime:
            stdscr.addstr(5, 2, "Loading anime details...")
            return
        
        title = f"Anime Details: {self.current_anime.get('title_en', 'Unknown')}"
        self.draw_header(stdscr, title)
        
        start_row = 3
        current_row = start_row
        
        info_lines = [
            f"Title (EN): {self.current_anime.get('title_en', 'N/A')}",
            f"Title (JP): {self.current_anime.get('title_jp', 'N/A')}",
            f"Episodes: {self.current_anime.get('episodes', 'N/A')}",
            f"Rating: ★{int(self.current_anime.get('rating', 0))}",
            f"Status: {self.current_anime.get('status', 'N/A')}",
            f"Type: {self.current_anime.get('type', 'N/A')}",
            "",
        ]
        
        for line in info_lines:
            if current_row >= height - 3:
                break
            stdscr.addstr(current_row, 2, line[:width-4])
            current_row += 1
        
        stdscr.addstr(height - 1, 1, "Press 'E' for episodes, 'B' to go back", curses.A_DIM)
    
    def draw_episodes(self, stdscr):
        height, width = stdscr.getmaxyx()
        
        title = f"Episodes: {self.current_anime.get('title_en', 'Unknown')}"
        self.draw_header(stdscr, title)
        
        start_row = 3
        
        if not self.episodes:
            stdscr.addstr(start_row + 2, 2, "No episodes available.")
            return
        
        episode_list = []
        for ep_num, qualities in self.episodes.items():
            episode_list.append((int(ep_num), qualities))
        episode_list.sort()
        
        visible_height = height - start_row - 3
        scroll_offset = max(0, self.episode_selected - visible_height // 2)
        
        for i, (ep_num, qualities) in enumerate(episode_list[scroll_offset:scroll_offset + visible_height]):
            actual_index = i + scroll_offset
            row = start_row + i
            
            if row >= height - 3:
                break
            
            attr = curses.A_REVERSE if actual_index == self.episode_selected else curses.A_NORMAL
            
            quality_list = list(qualities.keys())
            quality_str = ", ".join(quality_list)
            
            line = f"Episode {ep_num:3d} - Available: {quality_str}"
            line = line[:width-2]
            
            stdscr.addstr(row, 1, line, attr)
        
        if episode_list:
            selected_ep = episode_list[self.episode_selected][0]
            selected_qualities = episode_list[self.episode_selected][1]
            quality_keys = list(selected_qualities.keys())
            
            if quality_keys:
                current_quality = quality_keys[self.quality_selected % len(quality_keys)]
                servers = list(selected_qualities[current_quality].keys())
                current_server = servers[self.server_selected % len(servers)] if servers else "N/A"
                
                status = f"Episode {selected_ep} | Quality: {current_quality} | Server: {current_server} | Tab:Change Quality/Server"
                stdscr.addstr(height - 2, 1, status[:width-2], curses.A_DIM)
        
        stdscr.addstr(height - 1, 1, "Enter:Play with mpv | B:Back | Tab:Change Quality/Server", curses.A_DIM)
    
    def draw_search(self, stdscr):
        height, width = stdscr.getmaxyx()
        
        self.draw_header(stdscr, "Search Anime")
        
        stdscr.addstr(5, 2, "Enter search query:")
        stdscr.addstr(6, 2, f"Query: {self.search_query}")
        stdscr.addstr(8, 2, "Type your search and press Enter to search")
        stdscr.addstr(9, 2, "Press Esc to cancel")
        
        stdscr.move(6, 9 + len(self.search_query))
    
    def handle_search_input(self, stdscr, key):
        if key == 27:
            self.current_screen = "list"
            return
        elif key == ord('\n') or key == curses.KEY_ENTER:
            self.anime_list = self.fetch_anime_list(1, self.search_query)
            self.current_page = 1
            self.selected_index = 0
            self.current_screen = "list"
            return
        elif key == curses.KEY_BACKSPACE or key == 127:
            self.search_query = self.search_query[:-1]
        elif 32 <= key <= 126:
            self.search_query += chr(key)
    
    def run(self, stdscr):
        curses.curs_set(0)
        stdscr.keypad(True)
        
        self.anime_list = self.fetch_anime_list(self.current_page)
        
        while True:
            stdscr.clear()
            
            if self.current_screen == "list":
                self.draw_anime_list(stdscr)
            elif self.current_screen == "detail":
                self.draw_anime_detail(stdscr)
            elif self.current_screen == "episodes":
                self.draw_episodes(stdscr)
            elif self.current_screen == "search":
                self.draw_search(stdscr)
            
            stdscr.refresh()
            
            key = stdscr.getch()
            
            if self.current_screen == "search":
                self.handle_search_input(stdscr, key)
                continue
            
            if key == ord('q') or key == ord('Q'):
                break
            elif key == curses.KEY_UP or key == ord("k"):
                if self.current_screen == "list":
                    self.selected_index = max(0, self.selected_index - 1)
                elif self.current_screen == "episodes":
                    self.episode_selected = max(0, self.episode_selected - 1)
                    self.quality_selected = 0
                    self.server_selected = 0
            elif key == curses.KEY_DOWN or key == ord("j"):
                if self.current_screen == "list":
                    self.selected_index = min(len(self.anime_list) - 1, self.selected_index + 1)
                elif self.current_screen == "episodes":
                    episode_count = len(self.episodes)
                    self.episode_selected = min(episode_count - 1, self.episode_selected + 1)
                    self.quality_selected = 0
                    self.server_selected = 0

            
            if self.current_screen == "list":
                if key == ord('n') or key == ord('N'):
                    new_list = self.fetch_anime_list(self.current_page + 1, self.search_query)
                    if new_list:
                        self.current_page += 1
                        self.anime_list = new_list
                        self.selected_index = 0
                elif key == ord('b') or key == ord('B'):
                    if self.current_page > 1:
                        self.current_page -= 1
                        self.anime_list = self.fetch_anime_list(self.current_page, self.search_query)
                        self.selected_index = 0
                elif key == ord('s') or key == ord('S'):
                    self.search_query = ""
                    self.current_screen = "search"
                elif key == ord('\n') or key == curses.KEY_ENTER:
                    if self.anime_list and 0 <= self.selected_index < len(self.anime_list):
                        selected_anime = self.anime_list[self.selected_index]
                        slug = selected_anime.get('slug')
                        if slug:
                            self.current_anime = self.fetch_anime_detail(slug)
                            if self.current_anime:
                                self.screen_stack.append("list")
                                self.current_screen = "detail"
            
            elif self.current_screen == "detail":
                if key == ord('b') or key == ord('B'):
                    if self.screen_stack:
                        self.current_screen = self.screen_stack.pop()
                    else:
                        self.current_screen = "list"
                elif key == ord('e') or key == ord('E'):
                    if self.current_anime:
                        slug = self.current_anime.get('slug')
                        if slug:
                            self.episodes = self.fetch_episodes(slug)
                            if self.episodes:
                                self.screen_stack.append("detail")
                                self.current_screen = "episodes"
                                self.episode_selected = 0
                                self.quality_selected = 0
                                self.server_selected = 0
            
            elif self.current_screen == "episodes":
                if key == ord('b') or key == ord('B'):
                    if self.screen_stack:
                        self.current_screen = self.screen_stack.pop()
                    else:
                        self.current_screen = "detail"
                elif key == ord('\t'):
                    if self.episodes:
                        episode_list = [(int(k), v) for k, v in self.episodes.items()]
                        episode_list.sort()
                        
                        if 0 <= self.episode_selected < len(episode_list):
                            qualities = episode_list[self.episode_selected][1]
                            quality_keys = list(qualities.keys())
                            
                            if quality_keys:
                                current_quality = quality_keys[self.quality_selected % len(quality_keys)]
                                servers = list(qualities[current_quality].keys())
                                
                                self.server_selected = (self.server_selected + 1) % len(servers)
                                if self.server_selected == 0:
                                    self.quality_selected = (self.quality_selected + 1) % len(quality_keys)
                
                elif key == ord('\n') or key == curses.KEY_ENTER:
                    if self.episodes:
                        episode_list = [(int(k), v) for k, v in self.episodes.items()]
                        episode_list.sort()
                        
                        if 0 <= self.episode_selected < len(episode_list):
                            ep_num, qualities = episode_list[self.episode_selected]
                            quality_keys = list(qualities.keys())
                            
                            if quality_keys:
                                current_quality = quality_keys[self.quality_selected % len(quality_keys)]
                                servers = list(qualities[current_quality].keys())
                                
                                if servers:
                                    current_server = servers[self.server_selected % len(servers)]
                                    stream_path = qualities[current_quality][current_server]
                                    self.open_stream(stream_path)

def main():
    try:
        app = AnimeApp()
        curses.wrapper(app.run)
    except KeyboardInterrupt:
        print("\nGoodbye!")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
