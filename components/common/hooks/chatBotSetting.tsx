import chatBotStore from "@/store/zustand/chatBot";

export const useChatBotSetting = () => {
    const { activity_category_id, receiver_id } = chatBotStore(
        (state: any) => state
    );

    const changeUserId = (activity_category_id: any, receiver_id: any) => {
        chatBotStore.setState({ activity_category_id, receiver_id });
    };

    return {
        activity_category_id,
        receiver_id,
        changeUserId,
    };
};
