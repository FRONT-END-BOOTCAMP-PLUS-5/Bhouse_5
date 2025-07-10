// app/api/boardgames/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@bUtils/supabaseClient'

// API 설명
{
// /boardgames API
// 이 API는 보드게임 목록을 조회합니다.
// 요청 예시:
// http://127.0.0.1:3000/api/boardgames?name=브라스
// 응답 예시:

  // [{
  //   "boardgame_id": 4,
  //   "name": "브라스: 버밍엄",
  //   "description": "Brass: Birmingham is an economic strategy game sequel to Martin Wallace's 2007 masterpiece, Brass. Brass: Birmingham tells the story of competing entrepreneurs in Birmingham during the industrial revolution between the years of 1770 and 1870.&#10;&#10;It offers a very different story arc and experience from its predecessor. As in its predecessor, you must develop, build and establish your industries and network in an effort to exploit low or high market demands. The game is played over two halves: the canal era (years 1770-1830) and the rail era (years 1830-1870). To win the game, score the most VPs. VPs are counted at the end of each half for the canals, rails and established (flipped) industry tiles.&#10;&#10;Each round, players take turns according to the turn order track, receiving two actions to perform any of the following actions (found in the original game):&#10;&#10;1) Build - Pay required resources and place an industry tile.&#10;2) Network - Add a rail / canal link, expanding your network.&#10;3) Develop - Increase the VP value of an industry.&#10;4) Sell - Sell your cotton, manufactured goods and pottery.&#10;5) Loan - Take a &pound;30 loan and reduce your income.&#10;&#10;Brass: Birmingham also features a new sixth action:&#10;&#10;6) Scout - Discard three cards and take a wild location and wild industry card. (This action replaces Double Action Build in original Brass.)&#10;&#10;",
  //   "min_players": 2,
  //   "max_players": 4,
  //   "created_by": "0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196",
  //   "created_at": "2025-07-09T02:05:50.940974",
  //   "updated_at": "2025-07-09T02:05:50.940974+00:00",
  //   "updated_by": "0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196",
  //   "min_playtime": 60,
  //   "max_playtime": 120,
  //   "difficulty": 3.8684,
  //   "genre_id": 6,
  //   "img_url": "https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__original/img/FpyxH41Y6_ROoePAilPNEhXnzO8=/0x0/filters:format(jpeg)/pic3490053.jpg"
  // },
  //   {
  //   "boardgame_id": 24,
  //   "name": "브라스: 랭커셔",
  //   "description": "Brass: Lancashire &mdash; first published as Brass &mdash; is an economic strategy game that tells the story of competing cotton entrepreneurs in Lancashire during the industrial revolution. You must develop, build and establish your industries and network so that you can capitalize on demand for iron, coal and cotton. The game is played over two halves: the canal phase and the rail phase. To win the game, score the most victory points (VPs), which are counted at the end of each phase. VPs are gained from your canals, rails, and established (flipped) industry tiles. Each round, players take turns according to the turn order track, receiving two actions to perform any of the following:&#10;&#10;&#10;    Build an industry tile&#10;    Build a rail or canal&#10;    Develop an industry&#10;    Sell cotton&#10;    Take a loan&#10;&#10;&#10;At the end of your turn, you replace the two cards you played with two more from the deck. Turn order is determined by how much money a player spent on the previous turn, the lowest spender going first. This turn order mechanism opens some strategic options for players going later in the turn order, allowing for the possibility of back-to-back turns.&#10;&#10;After all the cards have been played the first time (with the deck size being adjusted for the number of players), the canal phase ends and a scoring round commences. After scoring, all canals and all of the lowest level industries are removed from the game, after which new cards are dealt and the rail phase begins. During this phase, players may now occupy more than one location in a city and double-connection builds (though expensive) are possible. At the end of the rail phase, another scoring round takes place, then a winner is crowned.&#10;&#10;The cards limit where you can build your industries, sell cotton or build connections (though any card can be used to 'develop'). This leads to a strategic timing/storing of cards. Resources are common so that if you build a rail line (which requires coal) you have to use the coal from the nearest source, which may be an opponent's coal mine, which in turn gets that coal mine closer to scoring (i.e., being utilized).&#10;&#10;Brass: Lancashire, the 2018 edition from Roxley Games, reboots the original Warfrog Games edition of Brass with new artwork and components, as well as a few rules changes:&#10;&#10;&#10;     The virtual link rules between Birkenhead have been made optional.&#10;     The three-player experience has been brought closer to the ideal experience of four players by shortening each half of the game by one round and tuning the deck and distant market tiles slightly to ensure a consistent experience.&#10;     Two-player rules have been created and are playable without the need of an alternate board.&#10;     The level 1 cotton mill is now worth 5 VP to make it slightly less terrible.&#10;&#10;&#10;",
  //   "min_players": 2,
  //   "max_players": 4,
  //   "created_by": "0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196",
  //   "created_at": "2025-07-09T02:55:37.088549",
  //   "updated_at": "2025-07-09T02:55:37.088549+00:00",
  //   "updated_by": "0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196",
  //   "min_playtime": 60,
  //   "max_playtime": 120,
  //   "difficulty": 3.8513,
  //   "genre_id": 26,
  //   "img_url": "https://cf.geekdo-images.com/tHVtPzu82mBpeQbbZkV6EA__original/img/3ffdJj5Pz6HQrg09Kh8ecTen-TY=/0x0/filters:format(jpeg)/pic3469216.jpg"
  // }]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const genre = searchParams.get('genre')
  const minPlayers = searchParams.get('minPlayers')
  const maxPlayers = searchParams.get('maxPlayers')

  let query = supabase.from('boardgames').select('*')

  if (name) {
    query = query.ilike('name', `%${name}%`)
  }

  if (genre) {
    query = query.contains('genres', [genre])  // genres가 array 컬럼일 경우
  }

  if (minPlayers) {
    query = query.gte('min_players', Number(minPlayers))
  }

  if (maxPlayers) {
    query = query.lte('max_players', Number(maxPlayers))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ message: '조회 실패', error }, { status: 500 })
  }

  return NextResponse.json(data)
}
