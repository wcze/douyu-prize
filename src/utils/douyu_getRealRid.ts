

/**
 * 获取斗鱼房间号的真实房间号信息
 * @param rid 靓号或房间号
 * @description 获取斗鱼房间号的真实房间号
 * @returns 真实房间号信息
 */
export function getRealRid(rid: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fetch(
            "/wxapp-douyucdn-cn/Live/Room/info/" + rid,
            {
                method: "GET",
                credentials: "include",
            }
        )
            .then((res) => {
                return res.json();
            })
            .then((ret) => {
                resolve(ret.data);
            })
            .catch(() => {
                reject(null);
            });
    });
}

export default getRealRid;