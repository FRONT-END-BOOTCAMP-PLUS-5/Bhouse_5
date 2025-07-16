import { NextRequest, NextResponse } from 'next/server'
import { UserTownRepositoryImpl } from '@be/infrastructure/repositories/UserTownRepositoryImpl'
import { DeleteUserTownUseCase } from '@be/application/user/certify-town/usecases/DeleteUserTownUseCase'
import { GetUserTownListUseCase } from '@be/application/user/certify-town/usecases/GetUserTownListUseCase'
import { VerifyUserTownUseCase } from '@be/application/user/certify-town/usecases/VerifyUSerTownUseCase'
import { verifyToken } from '@bUtils/auth'

const repo = new UserTownRepositoryImpl()
const verifyUseCase = new VerifyUserTownUseCase(repo)
const deleteUseCase = new DeleteUserTownUseCase(repo)
const getListUseCase = new GetUserTownListUseCase(repo)

// ✅ GET: 유저의 동네 목록 조회
export async function GET(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const userId = decoded.userId

    const towns = await getListUseCase.execute(userId)
    return NextResponse.json(towns)
  } catch (e) {
    console.error('GET user towns error:', e)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}

// ✅ POST: 동네 인증
export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const userId = decoded.userId

    const { townName, latitude, longitude } = await req.json()
    if (!townName || latitude == null || longitude == null) {
      return NextResponse.json({ message: '필수 필드가 누락되었습니다.' }, { status: 400 })
    }

    const result = await verifyUseCase.execute({
      userId,
      townName,
      lat: latitude,
      lng: longitude,
    })

    return NextResponse.json(result)
  } catch (e: any) {
    console.error('POST user town error:', e)
    return NextResponse.json({ message: e.message || 'Unauthorized' }, { status: 401 })
  }
}

// ✅ DELETE: 동네 삭제
export async function DELETE(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const userId = decoded.userId

    const { id } = await req.json()
    await deleteUseCase.execute({ id, userId })

    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (e: any) {
    console.error('DELETE user town error:', e)
    return NextResponse.json({ message: e.message || 'Unauthorized' }, { status: 401 })
  }
}
