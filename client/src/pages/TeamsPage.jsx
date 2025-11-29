                            </form >
                        </motion.div >
                    </div >
                )}
            </AnimatePresence >

    {/* Manage Team Modal */ }
    < ManageTeamModal
isOpen = {!!managingTeam}
onClose = {() => setManagingTeam(null)}
team = { managingTeam }
onUpdate = { fetchTeams }
    />
        </div >
    );
};

export default TeamsPage;
