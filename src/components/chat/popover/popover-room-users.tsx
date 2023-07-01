import { MemberInfo } from '@/types/member-info'
import Popover from '@/ui/overlay/popover'
import { User } from 'lucide-react'
import { Members } from 'pusher-js'
import { useMemo } from 'react'

interface Props {
    children: JSX.Element
    users: Members | null
}

export default function PopoverRoomUsers(props: Props) {
    const sortedMembers = useMemo(() => {
        if (!props.users?.members) return []

        const array = Object.values(props.users?.members) as MemberInfo[]
        return array.sort((a, b) => a.name.localeCompare(b.name))
    }, [props.users?.members])

    return (
        <Popover trigger={props.children}>
            <div className="flex flex-col space-y-2">
                {sortedMembers.map((user: MemberInfo) => (
                    <div className="flex items-center space-x-2">
                        <User size={20} />
                        <p>{user.name}</p>
                    </div>
                ))}
            </div>
        </Popover>
    )
}
